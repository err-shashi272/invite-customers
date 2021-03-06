define('ember-concurrency/-task-instance', ['exports', 'ember', 'ember-concurrency/utils'], function (exports, _ember, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.didCancel = didCancel;
  exports.go = go;
  exports.wrap = wrap;
  var set = _ember.default.set,
      get = _ember.default.get,
      computed = _ember.default.computed;


  var TASK_CANCELATION_NAME = 'TaskCancelation';

  var COMPLETION_PENDING = 0;
  var COMPLETION_SUCCESS = 1;
  var COMPLETION_ERROR = 2;
  var COMPLETION_CANCEL = 3;

  var GENERATOR_STATE_BEFORE_CREATE = "BEFORE_CREATE";
  var GENERATOR_STATE_HAS_MORE_VALUES = "HAS_MORE_VALUES";
  var GENERATOR_STATE_DONE = "DONE";
  var GENERATOR_STATE_ERRORED = "ERRORED";

  function handleYieldedUnknownThenable(thenable, taskInstance, resumeIndex) {
    thenable.then(function (value) {
      taskInstance.proceed(resumeIndex, _utils.YIELDABLE_CONTINUE, value);
    }, function (error) {
      taskInstance.proceed(resumeIndex, _utils.YIELDABLE_THROW, error);
    });
  }

  /**
   * Returns true if the object passed to it is a TaskCancelation error.
   * If you call `someTask.perform().catch(...)` or otherwise treat
   * a {@linkcode TaskInstance} like a promise, you may need to
   * handle the cancelation of a TaskInstance differently from
   * other kinds of errors it might throw, and you can use this
   * convenience function to distinguish cancelation from errors.
   *
   * ```js
   * click() {
   *   this.get('myTask').perform().catch(e => {
   *     if (!didCancel(e)) { throw e; }
   *   });
   * }
   * ```
   *
   * @param {Object} error the caught error, which might be a TaskCancelation
   * @returns {Boolean}
   */
  function didCancel(e) {
    return e && e.name === TASK_CANCELATION_NAME;
  }

  function forwardToInternalPromise(method) {
    return function () {
      var _get;

      this._hasSubscribed = true;
      return (_get = this.get('_promise'))[method].apply(_get, arguments);
    };
  }

  function spliceSlice(str, index, count, add) {
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  }

  var run = _ember.default.run;

  /**
    A `TaskInstance` represent a single execution of a
    {@linkcode Task}. Every call to {@linkcode Task#perform} returns
    a `TaskInstance`.
  
    `TaskInstance`s are cancelable, either explicitly
    via {@linkcode TaskInstance#cancel} or {@linkcode Task#cancelAll},
    or automatically due to the host object being destroyed, or
    because concurrency policy enforced by a
    {@linkcode TaskProperty Task Modifier} canceled the task instance.
  
    <style>
      .ignore-this--this-is-here-to-hide-constructor,
      #TaskInstance { display: none }
    </style>
  
    @class TaskInstance
  */
  var taskInstanceAttrs = {
    iterator: null,
    _disposer: null,
    _completionState: COMPLETION_PENDING,
    task: null,
    args: [],
    _hasSubscribed: false,
    _runLoop: true,
    _debug: false,
    cancelReason: null,

    /**
     * If this TaskInstance runs to completion by returning a property
     * other than a rejecting promise, this property will be set
     * with that value.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    value: null,

    /**
     * If this TaskInstance is canceled or throws an error (or yields
     * a promise that rejects), this property will be set with that error.
     * Otherwise, it is null.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    error: null,

    /**
     * True if the task instance is fulfilled.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isSuccessful: false,

    /**
     * True if the task instance resolves to a rejection.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isError: false,

    /**
     * True if the task instance was canceled before it could run to completion.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isCanceled: computed.and('isCanceling', 'isFinished'),
    isCanceling: false,

    /**
     * True if the task instance has started, else false.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    hasStarted: false,

    /**
     * True if the task has run to completion.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isFinished: false,

    /**
     * True if the task is still running.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isRunning: _ember.default.computed.not('isFinished'),

    /**
     * Describes the state that the task instance is in. Can be used for debugging,
     * or potentially driving some UI state. Possible values are:
     *
     * - `"dropped"`: task instance was canceled before it started
     * - `"canceled"`: task instance was canceled before it could finish
     * - `"finished"`: task instance ran to completion (even if an exception was thrown)
     * - `"running"`: task instance is currently running (returns true even if
     *     is paused on a yielded promise)
     * - `"waiting"`: task instance hasn't begun running yet (usually
     *     because the task is using the {@linkcode TaskProperty#enqueue .enqueue()}
     *     task modifier)
     *
     * The animated timeline examples on the [Task Concurrency](/#/docs/task-concurrency)
     * docs page make use of this property.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    state: _ember.default.computed('isDropped', 'isCanceling', 'hasStarted', 'isFinished', function () {
      if (get(this, 'isDropped')) {
        return 'dropped';
      } else if (get(this, 'isCanceling')) {
        return 'canceled';
      } else if (get(this, 'isFinished')) {
        return 'finished';
      } else if (get(this, 'hasStarted')) {
        return 'running';
      } else {
        return 'waiting';
      }
    }),

    /**
     * True if the TaskInstance was canceled before it could
     * ever start running. For example, calling
     * {@linkcode Task#perform .perform()} twice on a
     * task with the {@linkcode TaskProperty#drop .drop()} modifier applied
     * will result in the second task instance being dropped.
     *
     * @memberof TaskInstance
     * @instance
     * @readOnly
     */
    isDropped: _ember.default.computed('isCanceling', 'hasStarted', function () {
      return get(this, 'isCanceling') && !get(this, 'hasStarted');
    }),

    _index: 1,

    _start: function _start() {
      if (this.hasStarted || this.isCanceling) {
        return this;
      }
      set(this, 'hasStarted', true);
      this._scheduleProceed(_utils.YIELDABLE_CONTINUE, undefined);
      return this;
    },
    toString: function toString() {
      var taskString = "" + this.task;
      return spliceSlice(taskString, -1, 0, '.perform()');
    },
    cancel: function cancel() {
      var cancelReason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ".cancel() was explicitly called";

      if (this.isCanceling || get(this, 'isFinished')) {
        return;
      }
      set(this, 'isCanceling', true);

      var name = get(this, 'task._propertyName') || "<unknown>";
      set(this, 'cancelReason', 'TaskInstance \'' + name + '\' was canceled because ' + cancelReason + '. For more information, see: http://ember-concurrency.com/#/docs/task-cancelation-help');

      if (this.hasStarted) {
        this._proceedSoon(_utils.YIELDABLE_CANCEL, null);
      } else {
        this._finalize(null, COMPLETION_CANCEL);
      }
    },


    _defer: null,
    _promise: computed(function () {
      this._defer = _ember.default.RSVP.defer();
      this._maybeResolveDefer();
      return this._defer.promise;
    }),

    _maybeResolveDefer: function _maybeResolveDefer() {
      if (!this._defer || !this._completionState) {
        return;
      }

      if (this._completionState === COMPLETION_SUCCESS) {
        this._defer.resolve(this.value);
      } else {
        this._defer.reject(this.error);
      }
    },


    /**
     * Returns a promise that resolves with the value returned
     * from the task's (generator) function, or rejects with
     * either the exception thrown from the task function, or
     * an error with a `.name` property with value `"TaskCancelation"`.
     *
     * @method then
     * @memberof TaskInstance
     * @instance
     * @return {Promise}
     */
    then: forwardToInternalPromise('then'),

    /**
     * @method catch
     * @memberof TaskInstance
     * @instance
     * @return {Promise}
     */
    catch: forwardToInternalPromise('catch'),

    /**
     * @method finally
     * @memberof TaskInstance
     * @instance
     * @return {Promise}
     */
    finally: forwardToInternalPromise('finally'),

    _finalize: function _finalize(_value, _completionState) {
      var completionState = _completionState;
      var value = _value;
      this._index++;

      if (this.isCanceling) {
        completionState = COMPLETION_CANCEL;
        value = new Error(this.cancelReason);

        if (this._debug || _ember.default.ENV.DEBUG_TASKS) {
          _ember.default.Logger.log(this.cancelReason);
        }

        value.name = TASK_CANCELATION_NAME;
        value.taskInstance = this;
      }

      set(this, '_completionState', completionState);
      set(this, '_result', value);

      if (completionState === COMPLETION_SUCCESS) {
        set(this, 'isSuccessful', true);
        set(this, 'value', value);
      } else if (completionState === COMPLETION_ERROR) {
        set(this, 'isError', true);
        set(this, 'error', value);
      } else if (completionState === COMPLETION_CANCEL) {
        set(this, 'error', value);
      }

      set(this, 'isFinished', true);

      this._dispose();
      this._runFinalizeCallbacks();
    },


    _finalizeCallbacks: null,
    _onFinalize: function _onFinalize(callback) {
      if (!this._finalizeCallbacks) {
        this._finalizeCallbacks = [];
      }
      this._finalizeCallbacks.push(callback);

      if (this._completionState) {
        this._runFinalizeCallbacks();
      }
    },
    _runFinalizeCallbacks: function _runFinalizeCallbacks() {
      this._maybeResolveDefer();
      if (this._finalizeCallbacks) {
        for (var i = 0, l = this._finalizeCallbacks.length; i < l; ++i) {
          this._finalizeCallbacks[i]();
        }
        this._finalizeCallbacks = null;
      }

      this._maybeThrowUnhandledTaskErrorLater();
    },
    _maybeThrowUnhandledTaskErrorLater: function _maybeThrowUnhandledTaskErrorLater() {
      var _this = this;

      // this backports the Ember 2.0+ RSVP _onError 'after' microtask behavior to Ember < 2.0
      if (!this._hasSubscribed && this._completionState === COMPLETION_ERROR) {
        run.schedule(run.queues[run.queues.length - 1], function () {
          if (!_this._hasSubscribed && !didCancel(_this.error)) {
            _ember.default.RSVP.reject(_this.error);
          }
        });
      }
    },
    _dispose: function _dispose() {
      if (this._disposer) {
        var disposer = this._disposer;
        this._disposer = null;

        // TODO: test erroring disposer
        disposer();
      }
    },
    _isGeneratorDone: function _isGeneratorDone() {
      var state = this._generatorState;
      return state === GENERATOR_STATE_DONE || state === GENERATOR_STATE_ERRORED;
    },
    _resumeGenerator: function _resumeGenerator(nextValue, iteratorMethod) {
      _ember.default.assert("The task generator function has already run to completion. This is probably an ember-concurrency bug.", !this._isGeneratorDone());

      try {
        var iterator = this._getIterator();
        var result = iterator[iteratorMethod](nextValue);

        this._generatorValue = result.value;
        if (result.done) {
          this._generatorState = GENERATOR_STATE_DONE;
        } else {
          this._generatorState = GENERATOR_STATE_HAS_MORE_VALUES;
        }
      } catch (e) {
        this._generatorValue = e;
        this._generatorState = GENERATOR_STATE_ERRORED;
      }
    },
    _getIterator: function _getIterator() {
      if (!this.iterator) {
        this.iterator = this._makeIterator();
      }
      return this.iterator;
    },
    _makeIterator: function _makeIterator() {
      return this.fn.apply(this.context, this.args);
    },
    _advanceIndex: function _advanceIndex(index) {
      if (this._index === index) {
        return ++this._index;
      }
    },
    _proceedSoon: function _proceedSoon(yieldResumeType, value) {
      var _this2 = this;

      this._advanceIndex(this._index);
      if (this._runLoop) {
        joinAndSchedule('actions', this, this._proceed, yieldResumeType, value);
      } else {
        setTimeout(function () {
          return _this2._proceed(yieldResumeType, value);
        }, 1);
      }
    },
    proceed: function proceed(index, yieldResumeType, value) {
      if (this._completionState) {
        return;
      }
      if (!this._advanceIndex(index)) {
        return;
      }
      this._proceedSoon(yieldResumeType, value);
    },
    _scheduleProceed: function _scheduleProceed(yieldResumeType, value) {
      var _this3 = this;

      if (this._completionState) {
        return;
      }

      if (this._runLoop && !_ember.default.run.currentRunLoop) {
        _ember.default.run(this, this._proceed, yieldResumeType, value);
        return;
      } else if (!this._runLoop && _ember.default.run.currentRunLoop) {
        setTimeout(function () {
          return _this3._proceed(yieldResumeType, value);
        }, 1);
        return;
      } else {
        this._proceed(yieldResumeType, value);
      }
    },
    _proceed: function _proceed(yieldResumeType, value) {
      if (this._completionState) {
        return;
      }

      if (this._generatorState === GENERATOR_STATE_DONE) {
        this._handleResolvedReturnedValue(yieldResumeType, value);
      } else {
        this._handleResolvedContinueValue(yieldResumeType, value);
      }
    },
    _handleResolvedReturnedValue: function _handleResolvedReturnedValue(yieldResumeType, value) {
      // decide what to do in the case of `return maybeYieldable`;
      // value is the resolved value of the yieldable. We just
      // need to decide how to finalize.
      _ember.default.assert("expected completion state to be pending", this._completionState === COMPLETION_PENDING);
      _ember.default.assert("expected generator to be done", this._generatorState === GENERATOR_STATE_DONE);

      switch (yieldResumeType) {
        case _utils.YIELDABLE_CONTINUE:
        case _utils.YIELDABLE_RETURN:
          this._finalize(value, COMPLETION_SUCCESS);
          break;
        case _utils.YIELDABLE_THROW:
          this._finalize(value, COMPLETION_ERROR);
          break;
        case _utils.YIELDABLE_CANCEL:
          set(this, 'isCanceling', true);
          this._finalize(null, COMPLETION_CANCEL);
          break;
      }
    },


    _generatorState: GENERATOR_STATE_BEFORE_CREATE,
    _generatorValue: null,
    _handleResolvedContinueValue: function _handleResolvedContinueValue(_yieldResumeType, resumeValue) {
      var iteratorMethod = _yieldResumeType;
      if (iteratorMethod === _utils.YIELDABLE_CANCEL) {
        set(this, 'isCanceling', true);
        iteratorMethod = _utils.YIELDABLE_RETURN;
      }

      this._dispose();

      var beforeIndex = this._index;
      this._resumeGenerator(resumeValue, iteratorMethod);

      if (!this._advanceIndex(beforeIndex)) {
        return;
      }

      if (this._generatorState === GENERATOR_STATE_ERRORED) {
        this._finalize(this._generatorValue, COMPLETION_ERROR);
        return;
      }

      this._handleYieldedValue();
    },
    _handleYieldedValue: function _handleYieldedValue() {
      var yieldedValue = this._generatorValue;
      if (!yieldedValue) {
        this._proceedWithSimpleValue(yieldedValue);
        return;
      }

      if (yieldedValue instanceof _utils.RawValue) {
        this._proceedWithSimpleValue(yieldedValue.value);
        return;
      }

      this._addDisposer(yieldedValue.__ec_cancel__);

      if (yieldedValue[_utils.yieldableSymbol]) {
        this._invokeYieldable(yieldedValue);
      } else if (typeof yieldedValue.then === 'function') {
        handleYieldedUnknownThenable(yieldedValue, this, this._index);
      } else {
        this._proceedWithSimpleValue(yieldedValue);
      }
    },
    _proceedWithSimpleValue: function _proceedWithSimpleValue(yieldedValue) {
      this.proceed(this._index, _utils.YIELDABLE_CONTINUE, yieldedValue);
    },
    _addDisposer: function _addDisposer(maybeDisposer) {
      if (typeof maybeDisposer === 'function') {
        var priorDisposer = this._disposer;
        if (priorDisposer) {
          this._disposer = function () {
            priorDisposer();
            maybeDisposer();
          };
        } else {
          this._disposer = maybeDisposer;
        }
      }
    },
    _invokeYieldable: function _invokeYieldable(yieldedValue) {
      try {
        var maybeDisposer = yieldedValue[_utils.yieldableSymbol](this, this._index);
        this._addDisposer(maybeDisposer);
      } catch (e) {
        // TODO: handle erroneous yieldable implementation
      }
    }
  };

  taskInstanceAttrs[_utils.yieldableSymbol] = function handleYieldedTaskInstance(parentTaskInstance, resumeIndex) {
    var yieldedTaskInstance = this;
    yieldedTaskInstance._hasSubscribed = true;
    var state = yieldedTaskInstance._completionState;

    if (state) {
      if (state === COMPLETION_SUCCESS) {
        parentTaskInstance.proceed(resumeIndex, _utils.YIELDABLE_CONTINUE, yieldedTaskInstance.value);
      } else if (state === COMPLETION_ERROR) {
        parentTaskInstance.proceed(resumeIndex, _utils.YIELDABLE_THROW, yieldedTaskInstance.error);
      } else if (state === COMPLETION_CANCEL) {
        parentTaskInstance.proceed(resumeIndex, _utils.YIELDABLE_CANCEL, null);
      }
    } else {
      yieldedTaskInstance._onFinalize(function handleFinalizedYieldedTaskInstance() {
        handleYieldedTaskInstance.call(yieldedTaskInstance, parentTaskInstance, resumeIndex);
      });
      return function disposeYieldedTaskInstance() {
        // TODO: provide reason for cancelation.
        yieldedTaskInstance.cancel();
      };
    }
  };

  var TaskInstance = _ember.default.Object.extend(taskInstanceAttrs);

  function joinAndSchedule() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _ember.default.run.join(function () {
      var _Ember$run;

      (_Ember$run = _ember.default.run).schedule.apply(_Ember$run, args);
    });
  }

  function go(args, fn) {
    var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return TaskInstance.create(Object.assign({ args: args, fn: fn, context: this }, attrs))._start();
  }

  function wrap(fn) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return function wrappedRunnerFunction() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return go.call(this, args, fn, attrs);
    };
  }

  exports.default = TaskInstance;
});