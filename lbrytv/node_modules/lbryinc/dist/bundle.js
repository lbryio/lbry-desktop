(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lbry-redux"));
	else if(typeof define === 'function' && define.amd)
		define(["lbry-redux"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("lbry-redux")) : factory(root["lbry-redux"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "LBRYINC_ACTIONS", function() { return constants_action_types__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var constants_youtube__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "YOUTUBE_STATUSES", function() { return constants_youtube__WEBPACK_IMPORTED_MODULE_1__; });
/* harmony import */ var constants_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "ERRORS", function() { return constants_errors__WEBPACK_IMPORTED_MODULE_2__; });
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Lbryio", function() { return lbryio__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var rewards__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "rewards", function() { return rewards__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var redux_reducers_subscriptions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "subscriptionsReducer", function() { return redux_reducers_subscriptions__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var redux_middleware_sync__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(13);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "userStateSyncMiddleware", function() { return redux_middleware_sync__WEBPACK_IMPORTED_MODULE_6__["userStateSyncMiddleware"]; });

/* harmony import */ var util_transifex_upload__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(17);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doTransifexUpload", function() { return util_transifex_upload__WEBPACK_IMPORTED_MODULE_7__["doTransifexUpload"]; });

/* harmony import */ var redux_actions_auth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(23);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doGenerateAuthToken", function() { return redux_actions_auth__WEBPACK_IMPORTED_MODULE_8__["doGenerateAuthToken"]; });

/* harmony import */ var redux_actions_rewards__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(24);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doRewardList", function() { return redux_actions_rewards__WEBPACK_IMPORTED_MODULE_9__["doRewardList"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doClaimRewardType", function() { return redux_actions_rewards__WEBPACK_IMPORTED_MODULE_9__["doClaimRewardType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doClaimEligiblePurchaseRewards", function() { return redux_actions_rewards__WEBPACK_IMPORTED_MODULE_9__["doClaimEligiblePurchaseRewards"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doClaimRewardClearError", function() { return redux_actions_rewards__WEBPACK_IMPORTED_MODULE_9__["doClaimRewardClearError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchRewardedContent", function() { return redux_actions_rewards__WEBPACK_IMPORTED_MODULE_9__["doFetchRewardedContent"]; });

/* harmony import */ var redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(28);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doChannelSubscribe", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doChannelSubscribe"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doChannelUnsubscribe", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doChannelUnsubscribe"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doChannelSubscriptionEnableNotifications", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doChannelSubscriptionEnableNotifications"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doChannelSubscriptionDisableNotifications", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doChannelSubscriptionDisableNotifications"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doCheckSubscription", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doCheckSubscription"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doCheckSubscriptions", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doCheckSubscriptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doCheckSubscriptionsInit", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doCheckSubscriptionsInit"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doCompleteFirstRun", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doCompleteFirstRun"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchMySubscriptions", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doFetchMySubscriptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchRecommendedSubscriptions", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doFetchRecommendedSubscriptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doRemoveUnreadSubscription", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doRemoveUnreadSubscription"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doRemoveUnreadSubscriptions", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doRemoveUnreadSubscriptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doSetViewMode", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doSetViewMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doShowSuggestedSubs", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doShowSuggestedSubs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUpdateUnreadSubscriptions", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["doUpdateUnreadSubscriptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setSubscriptionLatest", function() { return redux_actions_subscriptions__WEBPACK_IMPORTED_MODULE_10__["setSubscriptionLatest"]; });

/* harmony import */ var redux_actions_user__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(27);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchInviteStatus", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doFetchInviteStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doInstallNew", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doInstallNew"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doInstallNewWithParams", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doInstallNewWithParams"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doAuthenticate", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doAuthenticate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserFetch", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserFetch"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserSignIn", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserSignIn"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserSignUp", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserSignUp"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserEmailNew", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserEmailNew"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserCheckEmailVerified", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserCheckEmailVerified"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserEmailToVerify", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserEmailToVerify"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserEmailVerifyFailure", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserEmailVerifyFailure"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserEmailVerify", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserEmailVerify"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserPhoneNew", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserPhoneNew"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserPhoneReset", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserPhoneReset"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserPhoneVerifyFailure", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserPhoneVerifyFailure"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserPhoneVerify", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserPhoneVerify"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchAccessToken", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doFetchAccessToken"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserResendVerificationEmail", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserResendVerificationEmail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserIdentityVerify", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserIdentityVerify"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserInviteNew", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserInviteNew"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doClaimYoutubeChannels", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doClaimYoutubeChannels"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doCheckYoutubeTransfer", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doCheckYoutubeTransfer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserSetReferrer", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserSetReferrer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserSetReferrerReset", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserSetReferrerReset"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserPasswordReset", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserPasswordReset"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserPasswordSet", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserPasswordSet"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUserCheckIfEmailExists", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doUserCheckIfEmailExists"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doClearEmailEntry", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doClearEmailEntry"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doClearPasswordEntry", function() { return redux_actions_user__WEBPACK_IMPORTED_MODULE_11__["doClearPasswordEntry"]; });

/* harmony import */ var redux_actions_cost_info__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(30);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchCostInfoForUri", function() { return redux_actions_cost_info__WEBPACK_IMPORTED_MODULE_12__["doFetchCostInfoForUri"]; });

/* harmony import */ var redux_actions_blacklist__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(31);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doBlackListedOutpointsSubscribe", function() { return redux_actions_blacklist__WEBPACK_IMPORTED_MODULE_13__["doBlackListedOutpointsSubscribe"]; });

/* harmony import */ var redux_actions_filtered__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(32);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFilteredOutpointsSubscribe", function() { return redux_actions_filtered__WEBPACK_IMPORTED_MODULE_14__["doFilteredOutpointsSubscribe"]; });

/* harmony import */ var redux_actions_homepage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(33);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchFeaturedUris", function() { return redux_actions_homepage__WEBPACK_IMPORTED_MODULE_15__["doFetchFeaturedUris"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchTrendingUris", function() { return redux_actions_homepage__WEBPACK_IMPORTED_MODULE_15__["doFetchTrendingUris"]; });

/* harmony import */ var redux_actions_stats__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(34);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchViewCount", function() { return redux_actions_stats__WEBPACK_IMPORTED_MODULE_16__["doFetchViewCount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doFetchSubCount", function() { return redux_actions_stats__WEBPACK_IMPORTED_MODULE_16__["doFetchSubCount"]; });

/* harmony import */ var redux_actions_sync__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(35);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doCheckSync", function() { return redux_actions_sync__WEBPACK_IMPORTED_MODULE_17__["doCheckSync"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doGetSync", function() { return redux_actions_sync__WEBPACK_IMPORTED_MODULE_17__["doGetSync"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doSetSync", function() { return redux_actions_sync__WEBPACK_IMPORTED_MODULE_17__["doSetSync"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doSetDefaultAccount", function() { return redux_actions_sync__WEBPACK_IMPORTED_MODULE_17__["doSetDefaultAccount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doSyncApply", function() { return redux_actions_sync__WEBPACK_IMPORTED_MODULE_17__["doSyncApply"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doResetSync", function() { return redux_actions_sync__WEBPACK_IMPORTED_MODULE_17__["doResetSync"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doSyncEncryptAndDecrypt", function() { return redux_actions_sync__WEBPACK_IMPORTED_MODULE_17__["doSyncEncryptAndDecrypt"]; });

/* harmony import */ var redux_actions_lbrytv__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(36);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "doUpdateUploadProgress", function() { return redux_actions_lbrytv__WEBPACK_IMPORTED_MODULE_18__["doUpdateUploadProgress"]; });

/* harmony import */ var redux_reducers_auth__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(37);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "authReducer", function() { return redux_reducers_auth__WEBPACK_IMPORTED_MODULE_19__["authReducer"]; });

/* harmony import */ var redux_reducers_rewards__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(38);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "rewardsReducer", function() { return redux_reducers_rewards__WEBPACK_IMPORTED_MODULE_20__["rewardsReducer"]; });

/* harmony import */ var redux_reducers_user__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(39);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "userReducer", function() { return redux_reducers_user__WEBPACK_IMPORTED_MODULE_21__["userReducer"]; });

/* harmony import */ var redux_reducers_cost_info__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(40);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "costInfoReducer", function() { return redux_reducers_cost_info__WEBPACK_IMPORTED_MODULE_22__["costInfoReducer"]; });

/* harmony import */ var redux_reducers_blacklist__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(41);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "blacklistReducer", function() { return redux_reducers_blacklist__WEBPACK_IMPORTED_MODULE_23__["blacklistReducer"]; });

/* harmony import */ var redux_reducers_filtered__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(42);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "filteredReducer", function() { return redux_reducers_filtered__WEBPACK_IMPORTED_MODULE_24__["filteredReducer"]; });

/* harmony import */ var redux_reducers_homepage__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(43);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "homepageReducer", function() { return redux_reducers_homepage__WEBPACK_IMPORTED_MODULE_25__["homepageReducer"]; });

/* harmony import */ var redux_reducers_stats__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(44);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "statsReducer", function() { return redux_reducers_stats__WEBPACK_IMPORTED_MODULE_26__["statsReducer"]; });

/* harmony import */ var redux_reducers_sync__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(45);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "syncReducer", function() { return redux_reducers_sync__WEBPACK_IMPORTED_MODULE_27__["syncReducer"]; });

/* harmony import */ var redux_reducers_lbrytv__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(46);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "lbrytvReducer", function() { return redux_reducers_lbrytv__WEBPACK_IMPORTED_MODULE_28__["lbrytvReducer"]; });

/* harmony import */ var redux_selectors_auth__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(47);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectAuthToken", function() { return redux_selectors_auth__WEBPACK_IMPORTED_MODULE_29__["selectAuthToken"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectIsAuthenticating", function() { return redux_selectors_auth__WEBPACK_IMPORTED_MODULE_29__["selectIsAuthenticating"]; });

/* harmony import */ var redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(25);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectClaimRewardError", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["makeSelectClaimRewardError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectIsRewardClaimPending", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["makeSelectIsRewardClaimPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectRewardAmountByType", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["makeSelectRewardAmountByType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectRewardByType", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["makeSelectRewardByType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectRewardByClaimCode", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["makeSelectRewardByClaimCode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUnclaimedRewardsByType", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectUnclaimedRewardsByType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectClaimedRewardsById", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectClaimedRewardsById"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectClaimedRewards", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectClaimedRewards"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectClaimedRewardsByTransactionId", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectClaimedRewardsByTransactionId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUnclaimedRewards", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectUnclaimedRewards"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectFetchingRewards", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectFetchingRewards"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUnclaimedRewardValue", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectUnclaimedRewardValue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectClaimsPendingByType", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectClaimsPendingByType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectClaimErrorsByType", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectClaimErrorsByType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectRewardContentClaimIds", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectRewardContentClaimIds"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectReferralReward", function() { return redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_30__["selectReferralReward"]; });

/* harmony import */ var redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(14);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectIsNew", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["makeSelectIsNew"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectIsSubscribed", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["makeSelectIsSubscribed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectUnreadByChannel", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["makeSelectUnreadByChannel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectEnabledChannelNotifications", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectEnabledChannelNotifications"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSubscriptions", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectSubscriptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectIsFetchingSubscriptions", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectIsFetchingSubscriptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectViewMode", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectViewMode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSuggested", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectSuggested"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectIsFetchingSuggested", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectIsFetchingSuggested"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSuggestedChannels", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectSuggestedChannels"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectFirstRunCompleted", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectFirstRunCompleted"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectShowSuggestedSubs", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectShowSuggestedSubs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSubscriptionsBeingFetched", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectSubscriptionsBeingFetched"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUnreadByChannel", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectUnreadByChannel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUnreadAmount", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectUnreadAmount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUnreadSubscriptions", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectUnreadSubscriptions"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSubscriptionClaims", function() { return redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_31__["selectSubscriptionClaims"]; });

/* harmony import */ var redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(26);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectAuthenticationIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectAuthenticationIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUser", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserEmail", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserEmail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserPhone", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserPhone"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserCountryCode", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserCountryCode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectEmailToVerify", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectEmailToVerify"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPhoneToVerify", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPhoneToVerify"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserIsRewardApproved", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserIsRewardApproved"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectEmailNewIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectEmailNewIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectEmailNewErrorMessage", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectEmailNewErrorMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPhoneNewErrorMessage", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPhoneNewErrorMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPhoneNewIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPhoneNewIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectEmailVerifyIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectEmailVerifyIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectEmailVerifyErrorMessage", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectEmailVerifyErrorMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectEmailAlreadyExists", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectEmailAlreadyExists"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectEmailDoesNotExist", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectEmailDoesNotExist"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectResendingVerificationEmail", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectResendingVerificationEmail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPhoneVerifyErrorMessage", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPhoneVerifyErrorMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPhoneVerifyIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPhoneVerifyIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectIdentityVerifyIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectIdentityVerifyIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectIdentityVerifyErrorMessage", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectIdentityVerifyErrorMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserIsVerificationCandidate", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserIsVerificationCandidate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectAccessToken", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectAccessToken"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteStatusIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserInviteStatusIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserInvitesRemaining", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserInvitesRemaining"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserInvitees", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserInvitees"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteStatusFailed", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserInviteStatusFailed"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteNewIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserInviteNewIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteNewErrorMessage", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserInviteNewErrorMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteReferralLink", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserInviteReferralLink"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteReferralCode", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserInviteReferralCode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUserVerifiedEmail", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectUserVerifiedEmail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectYoutubeChannels", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectYoutubeChannels"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectYouTubeImportPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectYouTubeImportPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectYouTubeImportError", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectYouTubeImportError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectYouTubeImportVideosComplete", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectYouTubeImportVideosComplete"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSetReferrerPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectSetReferrerPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSetReferrerError", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectSetReferrerError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPasswordResetIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPasswordResetIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPasswordResetSuccess", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPasswordResetSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPasswordResetError", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPasswordResetError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPasswordSetIsPending", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPasswordSetIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPasswordSetSuccess", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPasswordSetSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPasswordSetError", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPasswordSetError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectPasswordExists", function() { return redux_selectors_user__WEBPACK_IMPORTED_MODULE_32__["selectPasswordExists"]; });

/* harmony import */ var redux_selectors_cost_info__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(48);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectFetchingCostInfoForUri", function() { return redux_selectors_cost_info__WEBPACK_IMPORTED_MODULE_33__["makeSelectFetchingCostInfoForUri"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectCostInfoForUri", function() { return redux_selectors_cost_info__WEBPACK_IMPORTED_MODULE_33__["makeSelectCostInfoForUri"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectAllCostInfoByUri", function() { return redux_selectors_cost_info__WEBPACK_IMPORTED_MODULE_33__["selectAllCostInfoByUri"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectFetchingCostInfo", function() { return redux_selectors_cost_info__WEBPACK_IMPORTED_MODULE_33__["selectFetchingCostInfo"]; });

/* harmony import */ var redux_selectors_blacklist__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(49);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectBlackListedOutpoints", function() { return redux_selectors_blacklist__WEBPACK_IMPORTED_MODULE_34__["selectBlackListedOutpoints"]; });

/* harmony import */ var redux_selectors_filtered__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(50);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectFilteredOutpoints", function() { return redux_selectors_filtered__WEBPACK_IMPORTED_MODULE_35__["selectFilteredOutpoints"]; });

/* harmony import */ var redux_selectors_homepage__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(51);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectFeaturedUris", function() { return redux_selectors_homepage__WEBPACK_IMPORTED_MODULE_36__["selectFeaturedUris"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectFetchingFeaturedUris", function() { return redux_selectors_homepage__WEBPACK_IMPORTED_MODULE_36__["selectFetchingFeaturedUris"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectTrendingUris", function() { return redux_selectors_homepage__WEBPACK_IMPORTED_MODULE_36__["selectTrendingUris"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectFetchingTrendingUris", function() { return redux_selectors_homepage__WEBPACK_IMPORTED_MODULE_36__["selectFetchingTrendingUris"]; });

/* harmony import */ var redux_selectors_stats__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(52);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectViewCountForUri", function() { return redux_selectors_stats__WEBPACK_IMPORTED_MODULE_37__["makeSelectViewCountForUri"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeSelectSubCountForUri", function() { return redux_selectors_stats__WEBPACK_IMPORTED_MODULE_37__["makeSelectSubCountForUri"]; });

/* harmony import */ var redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(53);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectHasSyncedWallet", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectHasSyncedWallet"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSyncData", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectSyncData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSyncHash", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectSyncHash"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSetSyncErrorMessage", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectSetSyncErrorMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectGetSyncErrorMessage", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectGetSyncErrorMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectGetSyncIsPending", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectGetSyncIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSetSyncIsPending", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectSetSyncIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSyncApplyIsPending", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectSyncApplyIsPending"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectHashChanged", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectHashChanged"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSyncApplyErrorMessage", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectSyncApplyErrorMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectSyncApplyPasswordError", function() { return redux_selectors_sync__WEBPACK_IMPORTED_MODULE_38__["selectSyncApplyPasswordError"]; });

/* harmony import */ var redux_selectors_lbrytv__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(54);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectCurrentUploads", function() { return redux_selectors_lbrytv__WEBPACK_IMPORTED_MODULE_39__["selectCurrentUploads"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "selectUploadCount", function() { return redux_selectors_lbrytv__WEBPACK_IMPORTED_MODULE_39__["selectUploadCount"]; });






 // middleware

 // constants

 // Lbryio and rewards

 // utils

 // actions











 // reducers











 // selectors













/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GENERATE_AUTH_TOKEN_FAILURE", function() { return GENERATE_AUTH_TOKEN_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GENERATE_AUTH_TOKEN_STARTED", function() { return GENERATE_AUTH_TOKEN_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GENERATE_AUTH_TOKEN_SUCCESS", function() { return GENERATE_AUTH_TOKEN_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTHENTICATION_STARTED", function() { return AUTHENTICATION_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTHENTICATION_SUCCESS", function() { return AUTHENTICATION_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTHENTICATION_FAILURE", function() { return AUTHENTICATION_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_DECLINE", function() { return USER_EMAIL_DECLINE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_NEW_STARTED", function() { return USER_EMAIL_NEW_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_NEW_SUCCESS", function() { return USER_EMAIL_NEW_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_NEW_EXISTS", function() { return USER_EMAIL_NEW_EXISTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_NEW_DOES_NOT_EXIST", function() { return USER_EMAIL_NEW_DOES_NOT_EXIST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_NEW_FAILURE", function() { return USER_EMAIL_NEW_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_NEW_CLEAR_ENTRY", function() { return USER_EMAIL_NEW_CLEAR_ENTRY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_VERIFY_SET", function() { return USER_EMAIL_VERIFY_SET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_VERIFY_STARTED", function() { return USER_EMAIL_VERIFY_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_VERIFY_SUCCESS", function() { return USER_EMAIL_VERIFY_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_VERIFY_FAILURE", function() { return USER_EMAIL_VERIFY_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_VERIFY_RETRY_STARTED", function() { return USER_EMAIL_VERIFY_RETRY_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_VERIFY_RETRY_FAILURE", function() { return USER_EMAIL_VERIFY_RETRY_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_EMAIL_VERIFY_RETRY_SUCCESS", function() { return USER_EMAIL_VERIFY_RETRY_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PASSWORD_EXISTS", function() { return USER_PASSWORD_EXISTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PASSWORD_RESET_STARTED", function() { return USER_PASSWORD_RESET_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PASSWORD_RESET_SUCCESS", function() { return USER_PASSWORD_RESET_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PASSWORD_RESET_FAILURE", function() { return USER_PASSWORD_RESET_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PASSWORD_SET_STARTED", function() { return USER_PASSWORD_SET_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PASSWORD_SET_SUCCESS", function() { return USER_PASSWORD_SET_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PASSWORD_SET_FAILURE", function() { return USER_PASSWORD_SET_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PASSWORD_SET_CLEAR", function() { return USER_PASSWORD_SET_CLEAR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PHONE_RESET", function() { return USER_PHONE_RESET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PHONE_NEW_STARTED", function() { return USER_PHONE_NEW_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PHONE_NEW_SUCCESS", function() { return USER_PHONE_NEW_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PHONE_NEW_FAILURE", function() { return USER_PHONE_NEW_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PHONE_VERIFY_STARTED", function() { return USER_PHONE_VERIFY_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PHONE_VERIFY_SUCCESS", function() { return USER_PHONE_VERIFY_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_PHONE_VERIFY_FAILURE", function() { return USER_PHONE_VERIFY_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_IDENTITY_VERIFY_STARTED", function() { return USER_IDENTITY_VERIFY_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_IDENTITY_VERIFY_SUCCESS", function() { return USER_IDENTITY_VERIFY_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_IDENTITY_VERIFY_FAILURE", function() { return USER_IDENTITY_VERIFY_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_FETCH_STARTED", function() { return USER_FETCH_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_FETCH_SUCCESS", function() { return USER_FETCH_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_FETCH_FAILURE", function() { return USER_FETCH_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_INVITE_STATUS_FETCH_STARTED", function() { return USER_INVITE_STATUS_FETCH_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_INVITE_STATUS_FETCH_SUCCESS", function() { return USER_INVITE_STATUS_FETCH_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_INVITE_STATUS_FETCH_FAILURE", function() { return USER_INVITE_STATUS_FETCH_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_INVITE_NEW_STARTED", function() { return USER_INVITE_NEW_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_INVITE_NEW_SUCCESS", function() { return USER_INVITE_NEW_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_INVITE_NEW_FAILURE", function() { return USER_INVITE_NEW_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_ACCESS_TOKEN_SUCCESS", function() { return FETCH_ACCESS_TOKEN_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_YOUTUBE_IMPORT_STARTED", function() { return USER_YOUTUBE_IMPORT_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_YOUTUBE_IMPORT_FAILURE", function() { return USER_YOUTUBE_IMPORT_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_YOUTUBE_IMPORT_SUCCESS", function() { return USER_YOUTUBE_IMPORT_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_SET_REFERRER_STARTED", function() { return USER_SET_REFERRER_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_SET_REFERRER_SUCCESS", function() { return USER_SET_REFERRER_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_SET_REFERRER_FAILURE", function() { return USER_SET_REFERRER_FAILURE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "USER_SET_REFERRER_RESET", function() { return USER_SET_REFERRER_RESET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_FEATURED_CONTENT_STARTED", function() { return FETCH_FEATURED_CONTENT_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_FEATURED_CONTENT_COMPLETED", function() { return FETCH_FEATURED_CONTENT_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_TRENDING_CONTENT_STARTED", function() { return FETCH_TRENDING_CONTENT_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_TRENDING_CONTENT_COMPLETED", function() { return FETCH_TRENDING_CONTENT_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RESOLVE_URIS_STARTED", function() { return RESOLVE_URIS_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RESOLVE_URIS_COMPLETED", function() { return RESOLVE_URIS_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_CHANNEL_CLAIMS_STARTED", function() { return FETCH_CHANNEL_CLAIMS_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_CHANNEL_CLAIMS_COMPLETED", function() { return FETCH_CHANNEL_CLAIMS_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_CHANNEL_CLAIM_COUNT_STARTED", function() { return FETCH_CHANNEL_CLAIM_COUNT_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_CHANNEL_CLAIM_COUNT_COMPLETED", function() { return FETCH_CHANNEL_CLAIM_COUNT_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_CLAIM_LIST_MINE_STARTED", function() { return FETCH_CLAIM_LIST_MINE_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_CLAIM_LIST_MINE_COMPLETED", function() { return FETCH_CLAIM_LIST_MINE_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ABANDON_CLAIM_STARTED", function() { return ABANDON_CLAIM_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ABANDON_CLAIM_SUCCEEDED", function() { return ABANDON_CLAIM_SUCCEEDED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_CHANNEL_LIST_STARTED", function() { return FETCH_CHANNEL_LIST_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_CHANNEL_LIST_COMPLETED", function() { return FETCH_CHANNEL_LIST_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CREATE_CHANNEL_STARTED", function() { return CREATE_CHANNEL_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CREATE_CHANNEL_COMPLETED", function() { return CREATE_CHANNEL_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PUBLISH_STARTED", function() { return PUBLISH_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PUBLISH_COMPLETED", function() { return PUBLISH_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PUBLISH_FAILED", function() { return PUBLISH_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_PLAYING_URI", function() { return SET_PLAYING_URI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_CONTENT_POSITION", function() { return SET_CONTENT_POSITION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_CONTENT_LAST_VIEWED", function() { return SET_CONTENT_LAST_VIEWED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLEAR_CONTENT_HISTORY_URI", function() { return CLEAR_CONTENT_HISTORY_URI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLEAR_CONTENT_HISTORY_ALL", function() { return CLEAR_CONTENT_HISTORY_ALL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANNEL_SUBSCRIBE", function() { return CHANNEL_SUBSCRIBE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANNEL_UNSUBSCRIBE", function() { return CHANNEL_UNSUBSCRIBE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANNEL_SUBSCRIPTION_ENABLE_NOTIFICATIONS", function() { return CHANNEL_SUBSCRIPTION_ENABLE_NOTIFICATIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANNEL_SUBSCRIPTION_DISABLE_NOTIFICATIONS", function() { return CHANNEL_SUBSCRIPTION_DISABLE_NOTIFICATIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HAS_FETCHED_SUBSCRIPTIONS", function() { return HAS_FETCHED_SUBSCRIPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SUBSCRIPTION_LATEST", function() { return SET_SUBSCRIPTION_LATEST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_SUBSCRIPTION_UNREADS", function() { return UPDATE_SUBSCRIPTION_UNREADS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REMOVE_SUBSCRIPTION_UNREADS", function() { return REMOVE_SUBSCRIPTION_UNREADS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHECK_SUBSCRIPTION_STARTED", function() { return CHECK_SUBSCRIPTION_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHECK_SUBSCRIPTION_COMPLETED", function() { return CHECK_SUBSCRIPTION_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHECK_SUBSCRIPTIONS_SUBSCRIBE", function() { return CHECK_SUBSCRIPTIONS_SUBSCRIBE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_SUBSCRIPTIONS_START", function() { return FETCH_SUBSCRIPTIONS_START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_SUBSCRIPTIONS_FAIL", function() { return FETCH_SUBSCRIPTIONS_FAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_SUBSCRIPTIONS_SUCCESS", function() { return FETCH_SUBSCRIPTIONS_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_VIEW_MODE", function() { return SET_VIEW_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SUGGESTED_SUBSCRIPTIONS_START", function() { return GET_SUGGESTED_SUBSCRIPTIONS_START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SUGGESTED_SUBSCRIPTIONS_SUCCESS", function() { return GET_SUGGESTED_SUBSCRIPTIONS_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SUGGESTED_SUBSCRIPTIONS_FAIL", function() { return GET_SUGGESTED_SUBSCRIPTIONS_FAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUBSCRIPTION_FIRST_RUN_COMPLETED", function() { return SUBSCRIPTION_FIRST_RUN_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VIEW_SUGGESTED_SUBSCRIPTIONS", function() { return VIEW_SUGGESTED_SUBSCRIPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_BLACK_LISTED_CONTENT_STARTED", function() { return FETCH_BLACK_LISTED_CONTENT_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_BLACK_LISTED_CONTENT_COMPLETED", function() { return FETCH_BLACK_LISTED_CONTENT_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_BLACK_LISTED_CONTENT_FAILED", function() { return FETCH_BLACK_LISTED_CONTENT_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLACK_LISTED_CONTENT_SUBSCRIBE", function() { return BLACK_LISTED_CONTENT_SUBSCRIBE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_FILTERED_CONTENT_STARTED", function() { return FETCH_FILTERED_CONTENT_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_FILTERED_CONTENT_COMPLETED", function() { return FETCH_FILTERED_CONTENT_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_FILTERED_CONTENT_FAILED", function() { return FETCH_FILTERED_CONTENT_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FILTERED_CONTENT_SUBSCRIBE", function() { return FILTERED_CONTENT_SUBSCRIBE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_COST_INFO_STARTED", function() { return FETCH_COST_INFO_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_COST_INFO_COMPLETED", function() { return FETCH_COST_INFO_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_VIEW_COUNT_STARTED", function() { return FETCH_VIEW_COUNT_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_VIEW_COUNT_FAILED", function() { return FETCH_VIEW_COUNT_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_VIEW_COUNT_COMPLETED", function() { return FETCH_VIEW_COUNT_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_SUB_COUNT_STARTED", function() { return FETCH_SUB_COUNT_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_SUB_COUNT_FAILED", function() { return FETCH_SUB_COUNT_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FETCH_SUB_COUNT_COMPLETED", function() { return FETCH_SUB_COUNT_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SYNC_STARTED", function() { return GET_SYNC_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SYNC_COMPLETED", function() { return GET_SYNC_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GET_SYNC_FAILED", function() { return GET_SYNC_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SYNC_STARTED", function() { return SET_SYNC_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SYNC_FAILED", function() { return SET_SYNC_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_SYNC_COMPLETED", function() { return SET_SYNC_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_DEFAULT_ACCOUNT", function() { return SET_DEFAULT_ACCOUNT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SYNC_APPLY_STARTED", function() { return SYNC_APPLY_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SYNC_APPLY_COMPLETED", function() { return SYNC_APPLY_COMPLETED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SYNC_APPLY_FAILED", function() { return SYNC_APPLY_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SYNC_APPLY_BAD_PASSWORD", function() { return SYNC_APPLY_BAD_PASSWORD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SYNC_RESET", function() { return SYNC_RESET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UPDATE_UPLOAD_PROGRESS", function() { return UPDATE_UPLOAD_PROGRESS; });
// User
var GENERATE_AUTH_TOKEN_FAILURE = 'GENERATE_AUTH_TOKEN_FAILURE';
var GENERATE_AUTH_TOKEN_STARTED = 'GENERATE_AUTH_TOKEN_STARTED';
var GENERATE_AUTH_TOKEN_SUCCESS = 'GENERATE_AUTH_TOKEN_SUCCESS';
var AUTHENTICATION_STARTED = 'AUTHENTICATION_STARTED';
var AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
var AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE';
var USER_EMAIL_DECLINE = 'USER_EMAIL_DECLINE';
var USER_EMAIL_NEW_STARTED = 'USER_EMAIL_NEW_STARTED';
var USER_EMAIL_NEW_SUCCESS = 'USER_EMAIL_NEW_SUCCESS';
var USER_EMAIL_NEW_EXISTS = 'USER_EMAIL_NEW_EXISTS';
var USER_EMAIL_NEW_DOES_NOT_EXIST = 'USER_EMAIL_NEW_DOES_NOT_EXIST';
var USER_EMAIL_NEW_FAILURE = 'USER_EMAIL_NEW_FAILURE';
var USER_EMAIL_NEW_CLEAR_ENTRY = 'USER_EMAIL_NEW_CLEAR_ENTRY';
var USER_EMAIL_VERIFY_SET = 'USER_EMAIL_VERIFY_SET';
var USER_EMAIL_VERIFY_STARTED = 'USER_EMAIL_VERIFY_STARTED';
var USER_EMAIL_VERIFY_SUCCESS = 'USER_EMAIL_VERIFY_SUCCESS';
var USER_EMAIL_VERIFY_FAILURE = 'USER_EMAIL_VERIFY_FAILURE';
var USER_EMAIL_VERIFY_RETRY_STARTED = 'USER_EMAIL_VERIFY_RETRY_STARTED';
var USER_EMAIL_VERIFY_RETRY_FAILURE = 'USER_EMAIL_VERIFY_RETRY_FAILURE';
var USER_EMAIL_VERIFY_RETRY_SUCCESS = 'USER_EMAIL_VERIFY_RETRY_SUCCESS';
var USER_PASSWORD_EXISTS = 'USER_PASSWORD_EXISTS';
var USER_PASSWORD_RESET_STARTED = 'USER_PASSWORD_RESET_STARTED';
var USER_PASSWORD_RESET_SUCCESS = 'USER_PASSWORD_RESET_SUCCESS';
var USER_PASSWORD_RESET_FAILURE = 'USER_PASSWORD_RESET_FAILURE';
var USER_PASSWORD_SET_STARTED = 'USER_PASSWORD_SET_STARTED';
var USER_PASSWORD_SET_SUCCESS = 'USER_PASSWORD_SET_SUCCESS';
var USER_PASSWORD_SET_FAILURE = 'USER_PASSWORD_SET_FAILURE';
var USER_PASSWORD_SET_CLEAR = 'USER_PASSWORD_SET_CLEAR';
var USER_PHONE_RESET = 'USER_PHONE_RESET';
var USER_PHONE_NEW_STARTED = 'USER_PHONE_NEW_STARTED';
var USER_PHONE_NEW_SUCCESS = 'USER_PHONE_NEW_SUCCESS';
var USER_PHONE_NEW_FAILURE = 'USER_PHONE_NEW_FAILURE';
var USER_PHONE_VERIFY_STARTED = 'USER_PHONE_VERIFY_STARTED';
var USER_PHONE_VERIFY_SUCCESS = 'USER_PHONE_VERIFY_SUCCESS';
var USER_PHONE_VERIFY_FAILURE = 'USER_PHONE_VERIFY_FAILURE';
var USER_IDENTITY_VERIFY_STARTED = 'USER_IDENTITY_VERIFY_STARTED';
var USER_IDENTITY_VERIFY_SUCCESS = 'USER_IDENTITY_VERIFY_SUCCESS';
var USER_IDENTITY_VERIFY_FAILURE = 'USER_IDENTITY_VERIFY_FAILURE';
var USER_FETCH_STARTED = 'USER_FETCH_STARTED';
var USER_FETCH_SUCCESS = 'USER_FETCH_SUCCESS';
var USER_FETCH_FAILURE = 'USER_FETCH_FAILURE';
var USER_INVITE_STATUS_FETCH_STARTED = 'USER_INVITE_STATUS_FETCH_STARTED';
var USER_INVITE_STATUS_FETCH_SUCCESS = 'USER_INVITE_STATUS_FETCH_SUCCESS';
var USER_INVITE_STATUS_FETCH_FAILURE = 'USER_INVITE_STATUS_FETCH_FAILURE';
var USER_INVITE_NEW_STARTED = 'USER_INVITE_NEW_STARTED';
var USER_INVITE_NEW_SUCCESS = 'USER_INVITE_NEW_SUCCESS';
var USER_INVITE_NEW_FAILURE = 'USER_INVITE_NEW_FAILURE';
var FETCH_ACCESS_TOKEN_SUCCESS = 'FETCH_ACCESS_TOKEN_SUCCESS';
var USER_YOUTUBE_IMPORT_STARTED = 'USER_YOUTUBE_IMPORT_STARTED';
var USER_YOUTUBE_IMPORT_FAILURE = 'USER_YOUTUBE_IMPORT_FAILURE';
var USER_YOUTUBE_IMPORT_SUCCESS = 'USER_YOUTUBE_IMPORT_SUCCESS';
var USER_SET_REFERRER_STARTED = 'USER_SET_REFERRER_STARTED';
var USER_SET_REFERRER_SUCCESS = 'USER_SET_REFERRER_SUCCESS';
var USER_SET_REFERRER_FAILURE = 'USER_SET_REFERRER_FAILURE';
var USER_SET_REFERRER_RESET = 'USER_SET_REFERRER_RESET'; // Claims

var FETCH_FEATURED_CONTENT_STARTED = 'FETCH_FEATURED_CONTENT_STARTED';
var FETCH_FEATURED_CONTENT_COMPLETED = 'FETCH_FEATURED_CONTENT_COMPLETED';
var FETCH_TRENDING_CONTENT_STARTED = 'FETCH_TRENDING_CONTENT_STARTED';
var FETCH_TRENDING_CONTENT_COMPLETED = 'FETCH_TRENDING_CONTENT_COMPLETED';
var RESOLVE_URIS_STARTED = 'RESOLVE_URIS_STARTED';
var RESOLVE_URIS_COMPLETED = 'RESOLVE_URIS_COMPLETED';
var FETCH_CHANNEL_CLAIMS_STARTED = 'FETCH_CHANNEL_CLAIMS_STARTED';
var FETCH_CHANNEL_CLAIMS_COMPLETED = 'FETCH_CHANNEL_CLAIMS_COMPLETED';
var FETCH_CHANNEL_CLAIM_COUNT_STARTED = 'FETCH_CHANNEL_CLAIM_COUNT_STARTED';
var FETCH_CHANNEL_CLAIM_COUNT_COMPLETED = 'FETCH_CHANNEL_CLAIM_COUNT_COMPLETED';
var FETCH_CLAIM_LIST_MINE_STARTED = 'FETCH_CLAIM_LIST_MINE_STARTED';
var FETCH_CLAIM_LIST_MINE_COMPLETED = 'FETCH_CLAIM_LIST_MINE_COMPLETED';
var ABANDON_CLAIM_STARTED = 'ABANDON_CLAIM_STARTED';
var ABANDON_CLAIM_SUCCEEDED = 'ABANDON_CLAIM_SUCCEEDED';
var FETCH_CHANNEL_LIST_STARTED = 'FETCH_CHANNEL_LIST_STARTED';
var FETCH_CHANNEL_LIST_COMPLETED = 'FETCH_CHANNEL_LIST_COMPLETED';
var CREATE_CHANNEL_STARTED = 'CREATE_CHANNEL_STARTED';
var CREATE_CHANNEL_COMPLETED = 'CREATE_CHANNEL_COMPLETED';
var PUBLISH_STARTED = 'PUBLISH_STARTED';
var PUBLISH_COMPLETED = 'PUBLISH_COMPLETED';
var PUBLISH_FAILED = 'PUBLISH_FAILED';
var SET_PLAYING_URI = 'SET_PLAYING_URI';
var SET_CONTENT_POSITION = 'SET_CONTENT_POSITION';
var SET_CONTENT_LAST_VIEWED = 'SET_CONTENT_LAST_VIEWED';
var CLEAR_CONTENT_HISTORY_URI = 'CLEAR_CONTENT_HISTORY_URI';
var CLEAR_CONTENT_HISTORY_ALL = 'CLEAR_CONTENT_HISTORY_ALL'; // Subscriptions

var CHANNEL_SUBSCRIBE = 'CHANNEL_SUBSCRIBE';
var CHANNEL_UNSUBSCRIBE = 'CHANNEL_UNSUBSCRIBE';
var CHANNEL_SUBSCRIPTION_ENABLE_NOTIFICATIONS = 'CHANNEL_SUBSCRIPTION_ENABLE_NOTIFICATIONS';
var CHANNEL_SUBSCRIPTION_DISABLE_NOTIFICATIONS = 'CHANNEL_SUBSCRIPTION_DISABLE_NOTIFICATIONS';
var HAS_FETCHED_SUBSCRIPTIONS = 'HAS_FETCHED_SUBSCRIPTIONS';
var SET_SUBSCRIPTION_LATEST = 'SET_SUBSCRIPTION_LATEST';
var UPDATE_SUBSCRIPTION_UNREADS = 'UPDATE_SUBSCRIPTION_UNREADS';
var REMOVE_SUBSCRIPTION_UNREADS = 'REMOVE_SUBSCRIPTION_UNREADS';
var CHECK_SUBSCRIPTION_STARTED = 'CHECK_SUBSCRIPTION_STARTED';
var CHECK_SUBSCRIPTION_COMPLETED = 'CHECK_SUBSCRIPTION_COMPLETED';
var CHECK_SUBSCRIPTIONS_SUBSCRIBE = 'CHECK_SUBSCRIPTIONS_SUBSCRIBE';
var FETCH_SUBSCRIPTIONS_START = 'FETCH_SUBSCRIPTIONS_START';
var FETCH_SUBSCRIPTIONS_FAIL = 'FETCH_SUBSCRIPTIONS_FAIL';
var FETCH_SUBSCRIPTIONS_SUCCESS = 'FETCH_SUBSCRIPTIONS_SUCCESS';
var SET_VIEW_MODE = 'SET_VIEW_MODE';
var GET_SUGGESTED_SUBSCRIPTIONS_START = 'GET_SUGGESTED_SUBSCRIPTIONS_START';
var GET_SUGGESTED_SUBSCRIPTIONS_SUCCESS = 'GET_SUGGESTED_SUBSCRIPTIONS_SUCCESS';
var GET_SUGGESTED_SUBSCRIPTIONS_FAIL = 'GET_SUGGESTED_SUBSCRIPTIONS_FAIL';
var SUBSCRIPTION_FIRST_RUN_COMPLETED = 'SUBSCRIPTION_FIRST_RUN_COMPLETED';
var VIEW_SUGGESTED_SUBSCRIPTIONS = 'VIEW_SUGGESTED_SUBSCRIPTIONS'; // Blacklist

var FETCH_BLACK_LISTED_CONTENT_STARTED = 'FETCH_BLACK_LISTED_CONTENT_STARTED';
var FETCH_BLACK_LISTED_CONTENT_COMPLETED = 'FETCH_BLACK_LISTED_CONTENT_COMPLETED';
var FETCH_BLACK_LISTED_CONTENT_FAILED = 'FETCH_BLACK_LISTED_CONTENT_FAILED';
var BLACK_LISTED_CONTENT_SUBSCRIBE = 'BLACK_LISTED_CONTENT_SUBSCRIBE'; // Filtered list

var FETCH_FILTERED_CONTENT_STARTED = 'FETCH_FILTERED_CONTENT_STARTED';
var FETCH_FILTERED_CONTENT_COMPLETED = 'FETCH_FILTERED_CONTENT_COMPLETED';
var FETCH_FILTERED_CONTENT_FAILED = 'FETCH_FILTERED_CONTENT_FAILED';
var FILTERED_CONTENT_SUBSCRIBE = 'FILTERED_CONTENT_SUBSCRIBE'; // Cost Info

var FETCH_COST_INFO_STARTED = 'FETCH_COST_INFO_STARTED';
var FETCH_COST_INFO_COMPLETED = 'FETCH_COST_INFO_COMPLETED'; // Stats

var FETCH_VIEW_COUNT_STARTED = 'FETCH_VIEW_COUNT_STARTED';
var FETCH_VIEW_COUNT_FAILED = 'FETCH_VIEW_COUNT_FAILED';
var FETCH_VIEW_COUNT_COMPLETED = 'FETCH_VIEW_COUNT_COMPLETED';
var FETCH_SUB_COUNT_STARTED = 'FETCH_SUB_COUNT_STARTED';
var FETCH_SUB_COUNT_FAILED = 'FETCH_SUB_COUNT_FAILED';
var FETCH_SUB_COUNT_COMPLETED = 'FETCH_SUB_COUNT_COMPLETED'; // Cross-device Sync

var GET_SYNC_STARTED = 'GET_SYNC_STARTED';
var GET_SYNC_COMPLETED = 'GET_SYNC_COMPLETED';
var GET_SYNC_FAILED = 'GET_SYNC_FAILED';
var SET_SYNC_STARTED = 'SET_SYNC_STARTED';
var SET_SYNC_FAILED = 'SET_SYNC_FAILED';
var SET_SYNC_COMPLETED = 'SET_SYNC_COMPLETED';
var SET_DEFAULT_ACCOUNT = 'SET_DEFAULT_ACCOUNT';
var SYNC_APPLY_STARTED = 'SYNC_APPLY_STARTED';
var SYNC_APPLY_COMPLETED = 'SYNC_APPLY_COMPLETED';
var SYNC_APPLY_FAILED = 'SYNC_APPLY_FAILED';
var SYNC_APPLY_BAD_PASSWORD = 'SYNC_APPLY_BAD_PASSWORD';
var SYNC_RESET = 'SYNC_RESET'; // Lbry.tv

var UPDATE_UPLOAD_PROGRESS = 'UPDATE_UPLOAD_PROGRESS';

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOT_TRANSFERRED", function() { return NOT_TRANSFERRED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PENDING_TRANSFER", function() { return PENDING_TRANSFER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPLETED_TRANSFER", function() { return COMPLETED_TRANSFER; });
var NOT_TRANSFERRED = 'not_transferred';
var PENDING_TRANSFER = 'pending_transfer';
var COMPLETED_TRANSFER = 'completed_transfer';

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ALREADY_CLAIMED", function() { return ALREADY_CLAIMED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REFERRER_NOT_FOUND", function() { return REFERRER_NOT_FOUND; });
var ALREADY_CLAIMED = 'once the invite reward has been claimed the referrer cannot be changed';
var REFERRER_NOT_FOUND = 'A lbry.tv account could not be found for the referrer you provided.';

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(querystring__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var Lbryio = {
  enabled: true,
  authenticationPromise: null,
  exchangePromise: null,
  exchangeLastFetched: null,
  CONNECTION_STRING: 'https://api.lbry.com/'
};
var EXCHANGE_RATE_TIMEOUT = 20 * 60 * 1000; // We can't use env's because they aren't passed into node_modules

Lbryio.setLocalApi = function (endpoint) {
  Lbryio.CONNECTION_STRING = endpoint.replace(/\/*$/, '/'); // exactly one slash at the end;
};

Lbryio.call = function (resource, action) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'get';

  if (!Lbryio.enabled) {
    return Promise.reject(new Error(__('LBRY internal API is disabled')));
  }

  if (!(method === 'get' || method === 'post')) {
    return Promise.reject(new Error(__('Invalid method')));
  }

  function checkAndParse(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }

    return response.json().then(function (json) {
      var error;

      if (json.error) {
        error = new Error(json.error);
      } else {
        error = new Error('Unknown API error signature');
      }

      error.response = response; // This is primarily a hack used in actions/user.js

      return Promise.reject(error);
    });
  }

  function makeRequest(url, options) {
    return fetch(url, options).then(checkAndParse);
  }

  return Lbryio.getAuthToken().then(function (token) {
    var fullParams = _objectSpread({
      auth_token: token
    }, params);

    Object.keys(fullParams).forEach(function (key) {
      var value = fullParams[key];

      if (_typeof(value) === 'object') {
        fullParams[key] = JSON.stringify(value);
      }
    });
    var qs = querystring__WEBPACK_IMPORTED_MODULE_2___default.a.stringify(fullParams);
    var url = "".concat(Lbryio.CONNECTION_STRING).concat(resource, "/").concat(action, "?").concat(qs);
    var options = {
      method: 'GET'
    };

    if (method === 'post') {
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs
      };
      url = "".concat(Lbryio.CONNECTION_STRING).concat(resource, "/").concat(action);
    }

    return makeRequest(url, options).then(function (response) {
      return response.data;
    });
  });
};

Lbryio.authToken = null;

Lbryio.getAuthToken = function () {
  return new Promise(function (resolve) {
    if (Lbryio.authToken) {
      resolve(Lbryio.authToken);
    } else if (Lbryio.overrides.getAuthToken) {
      Lbryio.overrides.getAuthToken().then(function (token) {
        resolve(token);
      });
    } else if (typeof window !== 'undefined') {
      var _window = window,
          store = _window.store;

      if (store) {
        var state = store.getState();
        var token = state.auth ? state.auth.authToken : null;
        Lbryio.authToken = token;
        resolve(token);
      }

      resolve(null);
    } else {
      resolve(null);
    }
  });
};

Lbryio.getCurrentUser = function () {
  return Lbryio.call('user', 'me');
};

Lbryio.authenticate = function () {
  if (!Lbryio.enabled) {
    return new Promise(function (resolve) {
      resolve({
        id: 1,
        language: 'en',
        primary_email: 'disabled@lbry.io',
        has_verified_email: true,
        is_identity_verified: true,
        is_reward_approved: false
      });
    });
  }

  if (Lbryio.authenticationPromise === null) {
    Lbryio.authenticationPromise = new Promise(function (resolve, reject) {
      Lbryio.getAuthToken().then(function (token) {
        if (!token || token.length > 60) {
          return false;
        } // check that token works


        return Lbryio.getCurrentUser().then(function (user) {
          return user;
        })["catch"](function () {
          return false;
        });
      }).then(function (user) {
        if (user) {
          return user;
        }

        return lbry_redux__WEBPACK_IMPORTED_MODULE_1__["Lbry"].status().then(function (status) {
          if (Lbryio.overrides.setAuthToken) {
            return Lbryio.overrides.setAuthToken(status);
          } // simply call the logic to create a new user, and obtain the auth token


          return new Promise(function (res, rej) {
            Lbryio.call('user', 'new', {
              auth_token: '',
              language: 'en',
              app_id: status.installation_id
            }, 'post').then(function (response) {
              if (!response.auth_token) {
                throw new Error('auth_token was not set in the response');
              }

              var _window2 = window,
                  store = _window2.store;

              if (store) {
                store.dispatch({
                  type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GENERATE_AUTH_TOKEN_SUCCESS"],
                  data: {
                    authToken: response.auth_token
                  }
                });
              }

              Lbryio.authToken = response.auth_token;
              res(response);
            })["catch"](function (error) {
              return rej(error);
            });
          });
        });
      }).then(function (user) {
        if (!user) {
          return Lbryio.getCurrentUser();
        }

        return user;
      }).then(resolve, reject);
    });
  }

  return Lbryio.authenticationPromise;
};

Lbryio.getStripeToken = function () {
  return Lbryio.CONNECTION_STRING.startsWith('http://localhost:') ? 'pk_test_NoL1JWL7i1ipfhVId5KfDZgo' : 'pk_live_e8M4dRNnCCbmpZzduEUZBgJO';
};

Lbryio.getExchangeRates = function () {
  if (!Lbryio.exchangeLastFetched || Date.now() - Lbryio.exchangeLastFetched > EXCHANGE_RATE_TIMEOUT) {
    Lbryio.exchangePromise = new Promise(function (resolve, reject) {
      Lbryio.call('lbc', 'exchange_rate', {}, 'get', true).then(function (_ref) {
        var LBC_USD = _ref.lbc_usd,
            LBC_BTC = _ref.lbc_btc,
            BTC_USD = _ref.btc_usd;
        var rates = {
          LBC_USD: LBC_USD,
          LBC_BTC: LBC_BTC,
          BTC_USD: BTC_USD
        };
        resolve(rates);
      })["catch"](reject);
    });
    Lbryio.exchangeLastFetched = Date.now();
  }

  return Lbryio.exchangePromise;
}; // Allow overriding lbryio methods
// The desktop app will need to use it for getAuthToken because we use electron's ipcRenderer


Lbryio.overrides = {};

Lbryio.setOverride = function (methodName, newMethod) {
  Lbryio.overrides[methodName] = newMethod;
};

/* harmony default export */ __webpack_exports__["default"] = (Lbryio);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__5__;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(7);
exports.encode = exports.stringify = __webpack_require__(8);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var rewards = {};
rewards.TYPE_NEW_DEVELOPER = 'new_developer';
rewards.TYPE_NEW_USER = 'new_user';
rewards.TYPE_CONFIRM_EMAIL = 'email_provided';
rewards.TYPE_FIRST_CHANNEL = 'new_channel';
rewards.TYPE_FIRST_STREAM = 'first_stream';
rewards.TYPE_MANY_DOWNLOADS = 'many_downloads';
rewards.TYPE_FIRST_PUBLISH = 'first_publish';
rewards.TYPE_REFERRAL = 'referrer';
rewards.TYPE_REFEREE = 'referee';
rewards.TYPE_REWARD_CODE = 'reward_code';
rewards.TYPE_SUBSCRIPTION = 'subscription';
rewards.YOUTUBE_CREATOR = 'youtube_creator';
rewards.TYPE_DAILY_VIEW = 'daily_view';
rewards.TYPE_NEW_ANDROID = 'new_android';
rewards.TYPE_PAID_CONTENT = 'paid_content';

rewards.claimReward = function (type, rewardParams) {
  function requestReward(resolve, reject, params) {
    if (!lbryio__WEBPACK_IMPORTED_MODULE_1__["default"].enabled) {
      reject(new Error(__('Rewards are not enabled.')));
      return;
    }

    lbryio__WEBPACK_IMPORTED_MODULE_1__["default"].call('reward', 'claim', params, 'post').then(function (reward) {
      var message = reward.reward_notification || "You have claimed a ".concat(reward.reward_amount, " LBC reward."); // Display global notice

      var action = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_0__["doToast"])({
        message: message,
        linkText: __('Show All'),
        linkTarget: '/rewards'
      });
      window.store.dispatch(action);

      if (rewards.callbacks.claimRewardSuccess) {
        rewards.callbacks.claimRewardSuccess();
      }

      resolve(reward);
    }, reject);
  }

  return new Promise(function (resolve, reject) {
    lbry_redux__WEBPACK_IMPORTED_MODULE_0__["Lbry"].address_unused().then(function (address) {
      var params = _objectSpread({
        reward_type: type,
        wallet_address: address
      }, rewardParams);

      switch (type) {
        case rewards.TYPE_FIRST_CHANNEL:
          lbry_redux__WEBPACK_IMPORTED_MODULE_0__["Lbry"].channel_list({
            page: 1,
            page_size: 10
          }).then(function (claims) {
            var claim = claims.items && claims.items.find(function (foundClaim) {
              return foundClaim.name.length && foundClaim.name[0] === '@' && foundClaim.txid.length && foundClaim.type === 'claim';
            });

            if (claim) {
              params.transaction_id = claim.txid;
              requestReward(resolve, reject, params);
            } else {
              reject(new Error(__('Please create a channel identity first.')));
            }
          })["catch"](reject);
          break;

        case rewards.TYPE_FIRST_PUBLISH:
          lbry_redux__WEBPACK_IMPORTED_MODULE_0__["Lbry"].stream_list({
            page: 1,
            page_size: 10
          }).then(function (claims) {
            var claim = claims.items && claims.items.find(function (foundClaim) {
              return foundClaim.name.length && foundClaim.name[0] !== '@' && foundClaim.txid.length && foundClaim.type === 'claim';
            });

            if (claim) {
              params.transaction_id = claim.txid;
              requestReward(resolve, reject, params);
            } else {
              reject(claims.length ? new Error(__('Please publish something and wait for confirmation by the network to claim this reward.')) : new Error(__('Please publish something to claim this reward.')));
            }
          })["catch"](reject);
          break;

        case rewards.TYPE_FIRST_STREAM:
        case rewards.TYPE_NEW_USER:
        default:
          requestReward(resolve, reject, params);
      }
    });
  });
};

rewards.callbacks = {
  // Set any callbacks that require code not found in this project
  claimRewardSuccess: null,
  claimFirstRewardSuccess: null,
  rewardApprovalRequired: null
};

rewards.setCallback = function (name, method) {
  rewards.callbacks[name] = method;
};

/* harmony default export */ __webpack_exports__["default"] = (rewards);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var constants_subscriptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var util_redux_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
var _handleActions;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var defaultState = {
  enabledChannelNotifications: [],
  subscriptions: [],
  latest: {},
  unread: {},
  suggested: {},
  loading: false,
  viewMode: constants_subscriptions__WEBPACK_IMPORTED_MODULE_2__["VIEW_ALL"],
  loadingSuggested: false,
  firstRunCompleted: false,
  showSuggestedSubs: false
};
/* harmony default export */ __webpack_exports__["default"] = (Object(util_redux_utils__WEBPACK_IMPORTED_MODULE_3__["handleActions"])((_handleActions = {}, _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["CHANNEL_SUBSCRIBE"], function (state, action) {
  var newSubscription = action.data;
  var newSubscriptions = state.subscriptions.slice();

  if (!newSubscriptions.some(function (sub) {
    return sub.uri === newSubscription.uri;
  })) {
    newSubscriptions.unshift(newSubscription);
  }

  return _objectSpread({}, state, {
    subscriptions: newSubscriptions
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["CHANNEL_UNSUBSCRIBE"], function (state, action) {
  var subscriptionToRemove = action.data;
  var newSubscriptions = state.subscriptions.slice().filter(function (subscription) {
    return subscription.channelName !== subscriptionToRemove.channelName;
  }); // Check if we need to remove it from the 'unread' state

  var unread = state.unread;

  if (unread[subscriptionToRemove.uri]) {
    delete unread[subscriptionToRemove.uri];
  }

  return _objectSpread({}, state, {
    unread: _objectSpread({}, unread),
    subscriptions: newSubscriptions
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SET_SUBSCRIPTION_LATEST"], function (state, action) {
  var _action$data = action.data,
      subscription = _action$data.subscription,
      uri = _action$data.uri;
  var newLatest = Object.assign({}, state.latest);
  newLatest[subscription.uri] = uri;
  return _objectSpread({}, state, {
    latest: newLatest
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_SUBSCRIPTION_UNREADS"], function (state, action) {
  var _action$data2 = action.data,
      channel = _action$data2.channel,
      uris = _action$data2.uris,
      type = _action$data2.type;
  return _objectSpread({}, state, {
    unread: _objectSpread({}, state.unread, _defineProperty({}, channel, {
      uris: uris,
      type: type
    }))
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["REMOVE_SUBSCRIPTION_UNREADS"], function (state, action) {
  var _action$data3 = action.data,
      channel = _action$data3.channel,
      uris = _action$data3.uris; // If no channel is passed in, remove all unreads

  var newUnread;

  if (channel) {
    newUnread = _objectSpread({}, state.unread);

    if (!uris) {
      delete newUnread[channel];
    } else {
      newUnread[channel].uris = uris;
    }
  } else {
    newUnread = {};
  }

  return _objectSpread({}, state, {
    unread: _objectSpread({}, newUnread)
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["CHANNEL_SUBSCRIPTION_ENABLE_NOTIFICATIONS"], function (state, action) {
  var channelName = action.data;
  var newEnabledChannelNotifications = state.enabledChannelNotifications.slice();

  if (channelName && channelName.trim().length > 0 && newEnabledChannelNotifications.indexOf(channelName) === -1) {
    newEnabledChannelNotifications.push(channelName);
  }

  return _objectSpread({}, state, {
    enabledChannelNotifications: newEnabledChannelNotifications
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["CHANNEL_SUBSCRIPTION_DISABLE_NOTIFICATIONS"], function (state, action) {
  var channelName = action.data;
  var newEnabledChannelNotifications = state.enabledChannelNotifications.slice();
  var index = newEnabledChannelNotifications.indexOf(channelName);

  if (index > -1) {
    newEnabledChannelNotifications.splice(index, 1);
  }

  return _objectSpread({}, state, {
    enabledChannelNotifications: newEnabledChannelNotifications
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_SUBSCRIPTIONS_START"], function (state) {
  return _objectSpread({}, state, {
    loading: true
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_SUBSCRIPTIONS_FAIL"], function (state) {
  return _objectSpread({}, state, {
    loading: false
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_SUBSCRIPTIONS_SUCCESS"], function (state, action) {
  return _objectSpread({}, state, {
    loading: false,
    subscriptions: action.data
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SET_VIEW_MODE"], function (state, action) {
  return _objectSpread({}, state, {
    viewMode: action.data
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SUGGESTED_SUBSCRIPTIONS_START"], function (state) {
  return _objectSpread({}, state, {
    loadingSuggested: true
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SUGGESTED_SUBSCRIPTIONS_SUCCESS"], function (state, action) {
  return _objectSpread({}, state, {
    suggested: action.data,
    loadingSuggested: false
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SUGGESTED_SUBSCRIPTIONS_FAIL"], function (state) {
  return _objectSpread({}, state, {
    loadingSuggested: false
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SUBSCRIPTION_FIRST_RUN_COMPLETED"], function (state) {
  return _objectSpread({}, state, {
    firstRunCompleted: true
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["VIEW_SUGGESTED_SUBSCRIPTIONS"], function (state) {
  return _objectSpread({}, state, {
    showSuggestedSubs: true
  });
}), _defineProperty(_handleActions, lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].USER_STATE_POPULATE, function (state, action) {
  var subscriptions = action.data.subscriptions;
  var newSubscriptions;

  if (!subscriptions) {
    newSubscriptions = state.subscriptions;
  } else {
    var parsedSubscriptions = subscriptions.map(function (uri) {
      var _parseURI = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_1__["parseURI"])(uri),
          channelName = _parseURI.channelName;

      return {
        uri: uri,
        channelName: "@".concat(channelName)
      };
    });

    if (!state.subscriptions || !state.subscriptions.length) {
      newSubscriptions = parsedSubscriptions;
    } else {
      var map = {};
      newSubscriptions = parsedSubscriptions.concat(state.subscriptions).filter(function (sub) {
        return map[sub.uri] ? false : map[sub.uri] = true;
      }, {});
    }
  }

  return _objectSpread({}, state, {
    subscriptions: newSubscriptions
  });
}), _handleActions), defaultState));

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VIEW_ALL", function() { return VIEW_ALL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VIEW_LATEST_FIRST", function() { return VIEW_LATEST_FIRST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOWNLOADING", function() { return DOWNLOADING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOWNLOADED", function() { return DOWNLOADED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NOTIFY_ONLY", function() { return NOTIFY_ONLY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUGGESTED_TOP_BID", function() { return SUGGESTED_TOP_BID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUGGESTED_TOP_SUBSCRIBED", function() { return SUGGESTED_TOP_SUBSCRIBED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUGGESTED_FEATURED", function() { return SUGGESTED_FEATURED; });
var VIEW_ALL = 'view_all';
var VIEW_LATEST_FIRST = 'view_latest_first'; // Types for unreads

var DOWNLOADING = 'DOWNLOADING';
var DOWNLOADED = 'DOWNLOADED';
var NOTIFY_ONLY = 'NOTIFY_ONLY;'; // Suggested types

var SUGGESTED_TOP_BID = 'top_bid';
var SUGGESTED_TOP_SUBSCRIBED = 'top_subscribed';
var SUGGESTED_FEATURED = 'featured';

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleActions", function() { return handleActions; });
// util for creating reducers
// based off of redux-actions
// https://redux-actions.js.org/docs/api/handleAction.html#handleactions
// eslint-disable-next-line import/prefer-default-export
var handleActions = function handleActions(actionMap, defaultState) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var handler = actionMap[action.type];

    if (handler) {
      var newState = handler(state, action);
      return Object.assign({}, state, newState);
    } // just return the original state if no handler
    // returning a copy here breaks redux-persist


    return state;
  };
};

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userStateSyncMiddleware", function() { return userStateSyncMiddleware; });
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
/* harmony import */ var redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(14);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var persistShape = {
  version: '0',
  shared: {}
};
function userStateSyncMiddleware() {
  return function (_ref) {
    var getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (action.type === constants_action_types__WEBPACK_IMPORTED_MODULE_2__["CHANNEL_SUBSCRIBE"] || action.type === constants_action_types__WEBPACK_IMPORTED_MODULE_2__["CHANNEL_UNSUBSCRIBE"] || action.type === lbry_redux__WEBPACK_IMPORTED_MODULE_0__["ACTIONS"].TOGGLE_TAG_FOLLOW) {
          var newShape = _objectSpread({}, persistShape);

          var state = getState();
          var subscriptions = Object(redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_3__["selectSubscriptions"])(state).map(function (_ref2) {
            var uri = _ref2.uri;
            return uri;
          });
          var tags = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_0__["selectFollowedTags"])(state);
          newShape.shared.subscriptions = subscriptions;
          newShape.shared.tags = tags;
          var uri = action.data.uri;

          if (action.type === constants_action_types__WEBPACK_IMPORTED_MODULE_2__["CHANNEL_SUBSCRIBE"]) {
            var newSubscriptions = subscriptions.slice();
            newSubscriptions.push(uri);
            newShape.shared.subscriptions = newSubscriptions;
          } else if (action.type === constants_action_types__WEBPACK_IMPORTED_MODULE_2__["CHANNEL_UNSUBSCRIBE"]) {
            var _newSubscriptions = subscriptions.slice();

            _newSubscriptions = _newSubscriptions.filter(function (subscribedUri) {
              return subscribedUri !== uri;
            });
            newShape.shared.subscriptions = _newSubscriptions;
          } else {
            var toggledTag = action.data.name;
            var followedTags = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_0__["selectFollowedTags"])(state).map(function (_ref3) {
              var name = _ref3.name;
              return name;
            });
            var isFollowing = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_0__["makeSelectIsFollowingTag"])(toggledTag)(state);
            var newTags = followedTags.slice();

            if (isFollowing) {
              newTags = newTags.filter(function (followedTag) {
                return followedTag.name !== toggledTag;
              });
            } else {
              newTags.push(toggledTag);
            }

            newShape.shared.tags = newTags;
          }

          lbryio__WEBPACK_IMPORTED_MODULE_1__["default"].call('user_settings', 'set', {
            settings: newShape
          });
        }

        return next(action);
      };
    };
  };
}

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSubscriptions", function() { return selectSubscriptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectIsFetchingSubscriptions", function() { return selectIsFetchingSubscriptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectViewMode", function() { return selectViewMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSuggested", function() { return selectSuggested; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectIsFetchingSuggested", function() { return selectIsFetchingSuggested; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSuggestedChannels", function() { return selectSuggestedChannels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectFirstRunCompleted", function() { return selectFirstRunCompleted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectShowSuggestedSubs", function() { return selectShowSuggestedSubs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSubscriptionsBeingFetched", function() { return selectSubscriptionsBeingFetched; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUnreadByChannel", function() { return selectUnreadByChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUnreadAmount", function() { return selectUnreadAmount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUnreadSubscriptions", function() { return selectUnreadSubscriptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectUnreadByChannel", function() { return makeSelectUnreadByChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSubscriptionClaims", function() { return selectSubscriptionClaims; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectIsSubscribed", function() { return makeSelectIsSubscribed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectIsNew", function() { return makeSelectIsNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectEnabledChannelNotifications", function() { return selectEnabledChannelNotifications; });
/* harmony import */ var constants_subscriptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var util_swap_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(16);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




 // Returns the entire subscriptions state

var selectState = function selectState(state) {
  return state.subscriptions || {};
}; // Returns the list of channel uris a user is subscribed to


var selectSubscriptions = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectState, function (state) {
  return state.subscriptions;
}); // Fetching list of users subscriptions

var selectIsFetchingSubscriptions = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectState, function (state) {
  return state.loading;
}); // The current view mode on the subscriptions page

var selectViewMode = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectState, function (state) {
  return state.viewMode;
}); // Suggested subscriptions from internal apis

var selectSuggested = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectState, function (state) {
  return state.suggested;
});
var selectIsFetchingSuggested = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectState, function (state) {
  return state.loadingSuggested;
});
var selectSuggestedChannels = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectSubscriptions, selectSuggested, function (userSubscriptions, suggested) {
  if (!suggested) {
    return null;
  } // Swap the key/value because we will use the uri for everything, this just makes it easier
  // suggested is returned from the api with the form:
  // {
  //   featured: { "Channel label": uri, ... },
  //   top_subscribed: { "@channel": uri, ... }
  //   top_bid: { "@channel": uri, ... }
  // }
  // To properly compare the suggested subscriptions from our current subscribed channels
  // We only care about the uri, not the label
  // We also only care about top_subscribed and featured
  // top_bid could just be porn or a channel with no content


  var topSubscribedSuggestions = Object(util_swap_json__WEBPACK_IMPORTED_MODULE_3__["swapKeyAndValue"])(suggested[constants_subscriptions__WEBPACK_IMPORTED_MODULE_0__["SUGGESTED_TOP_SUBSCRIBED"]]);
  var featuredSuggestions = Object(util_swap_json__WEBPACK_IMPORTED_MODULE_3__["swapKeyAndValue"])(suggested[constants_subscriptions__WEBPACK_IMPORTED_MODULE_0__["SUGGESTED_FEATURED"]]); // Make sure there are no duplicates
  // If a uri isn't already in the suggested object, add it

  var suggestedChannels = _objectSpread({}, topSubscribedSuggestions);

  Object.keys(featuredSuggestions).forEach(function (uri) {
    if (!suggestedChannels[uri]) {
      var channelLabel = featuredSuggestions[uri];
      suggestedChannels[uri] = channelLabel;
    }
  });
  userSubscriptions.forEach(function (_ref) {
    var uri = _ref.uri;
    // Note to passer bys:
    // Maybe we should just remove the `lbry://` prefix from subscription uris
    // Most places don't store them like that
    var subscribedUri = uri.slice('lbry://'.length);

    if (suggestedChannels[subscribedUri]) {
      delete suggestedChannels[subscribedUri];
    }
  });
  return Object.keys(suggestedChannels).map(function (uri) {
    return {
      uri: uri,
      label: suggestedChannels[uri]
    };
  }).slice(0, 5);
});
var selectFirstRunCompleted = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectState, function (state) {
  return state.firstRunCompleted;
});
var selectShowSuggestedSubs = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectState, function (state) {
  return state.showSuggestedSubs;
}); // Fetching any claims that are a part of a users subscriptions

var selectSubscriptionsBeingFetched = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectSubscriptions, lbry_redux__WEBPACK_IMPORTED_MODULE_2__["selectAllFetchingChannelClaims"], function (subscriptions, fetchingChannelClaims) {
  var fetchingSubscriptionMap = {};
  subscriptions.forEach(function (sub) {
    var isFetching = fetchingChannelClaims && fetchingChannelClaims[sub.uri];

    if (isFetching) {
      fetchingSubscriptionMap[sub.uri] = true;
    }
  });
  return fetchingSubscriptionMap;
});
var selectUnreadByChannel = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectState, function (state) {
  return state.unread;
}); // Returns the current total of unread subscriptions

var selectUnreadAmount = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectUnreadByChannel, function (unreadByChannel) {
  var unreadChannels = Object.keys(unreadByChannel);
  var badges = 0;

  if (!unreadChannels.length) {
    return badges;
  }

  unreadChannels.forEach(function (channel) {
    badges += unreadByChannel[channel].uris.length;
  });
  return badges;
}); // Returns the uris with channels as an array with the channel with the newest content first
// If you just want the `unread` state, use selectUnread

var selectUnreadSubscriptions = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectUnreadAmount, selectUnreadByChannel, lbry_redux__WEBPACK_IMPORTED_MODULE_2__["selectClaimsByUri"], function (unreadAmount, unreadByChannel, claimsByUri) {
  // determine which channel has the newest content
  var unreadList = [];

  if (!unreadAmount) {
    return unreadList;
  }

  var channelUriList = Object.keys(unreadByChannel); // There is only one channel with unread notifications

  if (unreadAmount === 1) {
    channelUriList.forEach(function (channel) {
      var unreadChannel = {
        channel: channel,
        uris: unreadByChannel[channel].uris
      };
      unreadList.push(unreadChannel);
    });
    return unreadList;
  }

  channelUriList.sort(function (channel1, channel2) {
    var latestUriFromChannel1 = unreadByChannel[channel1].uris[0];
    var latestClaimFromChannel1 = claimsByUri[latestUriFromChannel1] || {};
    var latestUriFromChannel2 = unreadByChannel[channel2].uris[0];
    var latestClaimFromChannel2 = claimsByUri[latestUriFromChannel2] || {};
    var latestHeightFromChannel1 = latestClaimFromChannel1.height || 0;
    var latestHeightFromChannel2 = latestClaimFromChannel2.height || 0;

    if (latestHeightFromChannel1 !== latestHeightFromChannel2) {
      return latestHeightFromChannel2 - latestHeightFromChannel1;
    }

    return 0;
  }).forEach(function (channel) {
    var unreadSubscription = unreadByChannel[channel];
    var unreadChannel = {
      channel: channel,
      uris: unreadSubscription.uris
    };
    unreadList.push(unreadChannel);
  });
  return unreadList;
}); // Returns all unread subscriptions for a uri passed in

var makeSelectUnreadByChannel = function makeSelectUnreadByChannel(uri) {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectUnreadByChannel, function (unread) {
    return unread[uri];
  });
}; // Returns the first page of claims for every channel a user is subscribed to

var selectSubscriptionClaims = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(lbry_redux__WEBPACK_IMPORTED_MODULE_2__["selectAllClaimsByChannel"], lbry_redux__WEBPACK_IMPORTED_MODULE_2__["selectClaimsById"], selectSubscriptions, selectUnreadByChannel, function (channelIds, allClaims, savedSubscriptions, unreadByChannel) {
  // no claims loaded yet
  if (!Object.keys(channelIds).length) {
    return [];
  }

  var fetchedSubscriptions = [];
  savedSubscriptions.forEach(function (subscription) {
    var channelClaims = []; // if subscribed channel has content

    if (channelIds[subscription.uri] && channelIds[subscription.uri]['1']) {
      // This will need to be more robust, we will want to be able to load more than the first page
      // Strip out any ids that will be shown as notifications
      var pageOneChannelIds = channelIds[subscription.uri]['1']; // we have the channel ids and the corresponding claims
      // loop over the list of ids and grab the claim

      pageOneChannelIds.forEach(function (id) {
        var grabbedClaim = allClaims[id];

        if (unreadByChannel[subscription.uri] && unreadByChannel[subscription.uri].uris.some(function (uri) {
          return uri.includes(id);
        })) {
          grabbedClaim.isNew = true;
        }

        channelClaims = channelClaims.concat([grabbedClaim]);
      });
    }

    fetchedSubscriptions = fetchedSubscriptions.concat(channelClaims);
  });
  return fetchedSubscriptions;
}); // Returns true if a user is subscribed to the channel associated with the uri passed in
// Accepts content or channel uris

var makeSelectIsSubscribed = function makeSelectIsSubscribed(uri) {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectSubscriptions, Object(lbry_redux__WEBPACK_IMPORTED_MODULE_2__["makeSelectChannelForClaimUri"])(uri, true), function (subscriptions, channelUri) {
    if (channelUri) {
      return subscriptions.some(function (sub) {
        return sub.uri === channelUri;
      });
    } // If we couldn't get a channel uri from the claim uri, the uri passed in might be a channel already


    var _parseURI = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_2__["parseURI"])(uri),
        isChannel = _parseURI.isChannel;

    if (isChannel) {
      var uriWithPrefix = uri.startsWith('lbry://') ? uri : "lbry://".concat(uri);
      return subscriptions.some(function (sub) {
        return sub.uri === uriWithPrefix;
      });
    }

    return false;
  });
};
var makeSelectIsNew = function makeSelectIsNew(uri) {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(makeSelectIsSubscribed(uri), Object(lbry_redux__WEBPACK_IMPORTED_MODULE_2__["makeSelectChannelForClaimUri"])(uri), selectUnreadByChannel, function (isSubscribed, channel, unreadByChannel) {
    if (!isSubscribed) {
      return false;
    }

    var unreadForChannel = unreadByChannel["lbry://".concat(channel)];

    if (unreadForChannel) {
      return unreadForChannel.uris.includes(uri);
    }

    return false; // If they are subscribed, check to see if this uri is in the list of unreads
  });
};
var selectEnabledChannelNotifications = Object(reselect__WEBPACK_IMPORTED_MODULE_1__["createSelector"])(selectState, function (state) {
  return state.enabledChannelNotifications;
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.defaultMemoize = defaultMemoize;
exports.createSelectorCreator = createSelectorCreator;
exports.createStructuredSelector = createStructuredSelector;
function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;

  var lastArgs = null;
  var lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}

function getDependencies(funcs) {
  var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(function (dep) {
    return typeof dep === 'function';
  })) {
    var dependencyTypes = dependencies.map(function (dep) {
      return typeof dep;
    }).join(', ');
    throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
  }

  return dependencies;
}

function createSelectorCreator(memoize) {
  for (var _len = arguments.length, memoizeOptions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    memoizeOptions[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      funcs[_key2] = arguments[_key2];
    }

    var recomputations = 0;
    var resultFunc = funcs.pop();
    var dependencies = getDependencies(funcs);

    var memoizedResultFunc = memoize.apply(undefined, [function () {
      recomputations++;
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments);
    }].concat(memoizeOptions));

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    var selector = defaultMemoize(function () {
      var params = [];
      var length = dependencies.length;

      for (var i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments));
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params);
    });

    selector.resultFunc = resultFunc;
    selector.recomputations = function () {
      return recomputations;
    };
    selector.resetRecomputations = function () {
      return recomputations = 0;
    };
    return selector;
  };
}

var createSelector = exports.createSelector = createSelectorCreator(defaultMemoize);

function createStructuredSelector(selectors) {
  var selectorCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : createSelector;

  if (typeof selectors !== 'object') {
    throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
  }
  var objectKeys = Object.keys(selectors);
  return selectorCreator(objectKeys.map(function (key) {
    return selectors[key];
  }), function () {
    for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      values[_key3] = arguments[_key3];
    }

    return values.reduce(function (composition, value, index) {
      composition[objectKeys[index]] = value;
      return composition;
    }, {});
  });
}

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "swapKeyAndValue", function() { return swapKeyAndValue; });
function swapKeyAndValue(dict) {
  var ret = {}; // eslint-disable-next-line no-restricted-syntax

  for (var key in dict) {
    if (dict.hasOwnProperty(key)) {
      ret[dict[key]] = key;
    }
  }

  return ret;
}

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doTransifexUpload", function() { return doTransifexUpload; });
var apiBaseUrl = 'https://www.transifex.com/api/2/project';
var resource = 'app-strings';
function doTransifexUpload(contents, project, token, success, fail) {
  var url = "".concat(apiBaseUrl, "/").concat(project, "/resources/");
  var updateUrl = "".concat(apiBaseUrl, "/").concat(project, "/resource/").concat(resource, "/content/");
  var headers = {
    Authorization: "Basic ".concat(Buffer.from("api:".concat(token)).toString('base64')),
    'Content-Type': 'application/json'
  };
  var req = {
    accept_translations: true,
    i18n_type: 'KEYVALUEJSON',
    name: resource,
    slug: resource,
    content: contents
  };

  function handleResponse(text) {
    var json;

    try {
      // transifex api returns Python dicts for some reason.
      // Any way to get the api to return valid JSON?
      json = JSON.parse(text);
    } catch (e) {// ignore
    }

    if (success) {
      success(json || text);
    }
  }

  function handleError(err) {
    if (fail) {
      fail(err.message ? err.message : 'Could not upload strings resource to Transifex');
    }
  } // check if the resource exists


  fetch(updateUrl, {
    headers: headers
  }).then(function (response) {
    return response.json();
  }).then(function () {
    // perform an update
    fetch(updateUrl, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({
        content: contents
      })
    }).then(function (response) {
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('failed to update transifex');
      }

      return response.text();
    }).then(handleResponse)["catch"](handleError);
  })["catch"](function () {
    // resource doesn't exist, create a fresh resource
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req)
    }).then(function (response) {
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('failed to upload to transifex');
      }

      return response.text();
    }).then(handleResponse)["catch"](handleError);
  });
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(18).Buffer))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(20)
var ieee754 = __webpack_require__(21)
var isArray = __webpack_require__(22)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(19)))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 21 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doGenerateAuthToken", function() { return doGenerateAuthToken; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);


function doGenerateAuthToken(installationId) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GENERATE_AUTH_TOKEN_STARTED"]
    });
    lbryio__WEBPACK_IMPORTED_MODULE_1__["default"].call('user', 'new', {
      auth_token: '',
      language: 'en',
      app_id: installationId
    }, 'post').then(function (response) {
      if (!response.auth_token) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GENERATE_AUTH_TOKEN_FAILURE"]
        });
      } else {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GENERATE_AUTH_TOKEN_SUCCESS"],
          data: {
            authToken: response.auth_token
          }
        });
      }
    })["catch"](function () {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GENERATE_AUTH_TOKEN_FAILURE"]
      });
    });
  };
}

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doRewardList", function() { return doRewardList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doClaimRewardType", function() { return doClaimRewardType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doClaimEligiblePurchaseRewards", function() { return doClaimEligiblePurchaseRewards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doClaimRewardClearError", function() { return doClaimRewardClearError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchRewardedContent", function() { return doFetchRewardedContent; });
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);
/* harmony import */ var redux_selectors_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(26);
/* harmony import */ var redux_actions_user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(27);
/* harmony import */ var rewards__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);






function doRewardList() {
  return function (dispatch) {
    dispatch({
      type: lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].FETCH_REWARDS_STARTED
    });
    lbryio__WEBPACK_IMPORTED_MODULE_0__["default"].call('reward', 'list', {
      multiple_rewards_per_type: true
    }).then(function (userRewards) {
      dispatch({
        type: lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].FETCH_REWARDS_COMPLETED,
        data: {
          userRewards: userRewards
        }
      });
    })["catch"](function () {
      dispatch({
        type: lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].FETCH_REWARDS_COMPLETED,
        data: {
          userRewards: []
        }
      });
    });
  };
}
function doClaimRewardType(rewardType) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, getState) {
    var state = getState();
    var userIsRewardApproved = Object(redux_selectors_user__WEBPACK_IMPORTED_MODULE_3__["selectUserIsRewardApproved"])(state);
    var unclaimedRewards = Object(redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_2__["selectUnclaimedRewards"])(state);
    var reward = rewardType === rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_REWARD_CODE || rewardType === rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_NEW_ANDROID ? {
      reward_type: rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_REWARD_CODE
    } : unclaimedRewards.find(function (ur) {
      return ur.reward_type === rewardType;
    }); // Try to claim the email reward right away, even if we haven't called reward_list yet

    if (rewardType !== rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_REWARD_CODE && rewardType !== rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_CONFIRM_EMAIL && rewardType !== rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_DAILY_VIEW && rewardType !== rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_NEW_ANDROID && rewardType !== rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_PAID_CONTENT) {
      if (!reward || reward.transaction_id) {
        // already claimed or doesn't exist, do nothing
        return;
      }
    }

    if (!userIsRewardApproved && rewardType !== rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_CONFIRM_EMAIL && rewardType !== rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_REWARD_CODE && rewardType !== rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_NEW_ANDROID) {
      if (!options || !options.failSilently && rewards__WEBPACK_IMPORTED_MODULE_5__["default"].callbacks.rewardApprovalRequested) {
        rewards__WEBPACK_IMPORTED_MODULE_5__["default"].callbacks.rewardApprovalRequested();
      }

      return;
    } // Set `claim_code` so the api knows which reward to give if there are multiple of the same type


    var params = options.params || {};

    if (!params.claim_code && reward) {
      params.claim_code = reward.claim_code;
    }

    dispatch({
      type: lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].CLAIM_REWARD_STARTED,
      data: {
        reward: reward
      }
    });

    var success = function success(successReward) {
      // Temporary timeout to ensure the sdk has the correct balance after claiming a reward
      setTimeout(function () {
        dispatch(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_1__["doUpdateBalance"])()).then(function () {
          dispatch({
            type: lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].CLAIM_REWARD_SUCCESS,
            data: {
              reward: successReward
            }
          });

          if (successReward.reward_type === rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_NEW_USER && rewards__WEBPACK_IMPORTED_MODULE_5__["default"].callbacks.claimFirstRewardSuccess) {
            rewards__WEBPACK_IMPORTED_MODULE_5__["default"].callbacks.claimFirstRewardSuccess();
          } else if (successReward.reward_type === rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_REFERRAL) {
            dispatch(Object(redux_actions_user__WEBPACK_IMPORTED_MODULE_4__["doFetchInviteStatus"])());
          }

          dispatch(doRewardList());

          if (options.callback) {
            options.callback();
          }
        });
      }, 2000);
    };

    var failure = function failure(error) {
      dispatch({
        type: lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].CLAIM_REWARD_FAILURE,
        data: {
          reward: reward,
          error: !options || !options.failSilently ? error : undefined
        }
      });

      if (options.notifyError) {
        dispatch(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_1__["doToast"])({
          message: error.message,
          isError: true
        }));
      }

      if (options.callback) {
        options.callback(error);
      }
    };

    return rewards__WEBPACK_IMPORTED_MODULE_5__["default"].claimReward(rewardType, params).then(success, failure);
  };
}
function doClaimEligiblePurchaseRewards() {
  return function (dispatch, getState) {
    var state = getState();
    var unclaimedRewards = Object(redux_selectors_rewards__WEBPACK_IMPORTED_MODULE_2__["selectUnclaimedRewards"])(state);
    var userIsRewardApproved = Object(redux_selectors_user__WEBPACK_IMPORTED_MODULE_3__["selectUserIsRewardApproved"])(state);

    if (!userIsRewardApproved || !lbryio__WEBPACK_IMPORTED_MODULE_0__["default"].enabled) {
      return;
    }

    if (unclaimedRewards.find(function (ur) {
      return ur.reward_type === rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_FIRST_STREAM;
    })) {
      dispatch(doClaimRewardType(rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_FIRST_STREAM));
    } else {
      [rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_MANY_DOWNLOADS, rewards__WEBPACK_IMPORTED_MODULE_5__["default"].TYPE_DAILY_VIEW].forEach(function (type) {
        dispatch(doClaimRewardType(type, {
          failSilently: true
        }));
      });
    }
  };
}
function doClaimRewardClearError(reward) {
  return function (dispatch) {
    dispatch({
      type: lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].CLAIM_REWARD_CLEAR_ERROR,
      data: {
        reward: reward
      }
    });
  };
}
function doFetchRewardedContent() {
  return function (dispatch) {
    var success = function success(nameToClaimId) {
      dispatch({
        type: lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].FETCH_REWARD_CONTENT_COMPLETED,
        data: {
          claimIds: Object.values(nameToClaimId),
          success: true
        }
      });
    };

    var failure = function failure() {
      dispatch({
        type: lbry_redux__WEBPACK_IMPORTED_MODULE_1__["ACTIONS"].FETCH_REWARD_CONTENT_COMPLETED,
        data: {
          claimIds: [],
          success: false
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_0__["default"].call('reward', 'list_featured').then(success, failure);
  };
}

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUnclaimedRewardsByType", function() { return selectUnclaimedRewardsByType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectClaimedRewardsById", function() { return selectClaimedRewardsById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectClaimedRewards", function() { return selectClaimedRewards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectClaimedRewardsByTransactionId", function() { return selectClaimedRewardsByTransactionId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUnclaimedRewards", function() { return selectUnclaimedRewards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectFetchingRewards", function() { return selectFetchingRewards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUnclaimedRewardValue", function() { return selectUnclaimedRewardValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectClaimsPendingByType", function() { return selectClaimsPendingByType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectIsRewardClaimPending", function() { return makeSelectIsRewardClaimPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectClaimErrorsByType", function() { return selectClaimErrorsByType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectClaimRewardError", function() { return makeSelectClaimRewardError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectRewardByType", function() { return makeSelectRewardByType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectRewardByClaimCode", function() { return makeSelectRewardByClaimCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectRewardAmountByType", function() { return makeSelectRewardAmountByType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectRewardContentClaimIds", function() { return selectRewardContentClaimIds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectReferralReward", function() { return selectReferralReward; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var rewards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);



var selectState = function selectState(state) {
  return state.rewards || {};
};

var selectUnclaimedRewardsByType = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.unclaimedRewardsByType;
});
var selectClaimedRewardsById = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.claimedRewardsById;
});
var selectClaimedRewards = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectClaimedRewardsById, function (byId) {
  return Object.values(byId) || [];
});
var selectClaimedRewardsByTransactionId = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectClaimedRewards, function (rewards) {
  return rewards.reduce(function (mapParam, reward) {
    var map = mapParam;
    map[reward.transaction_id] = reward;
    return map;
  }, {});
});
var selectUnclaimedRewards = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.unclaimedRewards;
});
var selectFetchingRewards = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return !!state.fetching;
});
var selectUnclaimedRewardValue = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUnclaimedRewards, function (rewards) {
  return rewards.reduce(function (sum, reward) {
    return sum + reward.reward_amount;
  }, 0);
});
var selectClaimsPendingByType = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.claimPendingByType;
});

var selectIsClaimRewardPending = function selectIsClaimRewardPending(state, props) {
  return selectClaimsPendingByType(state, props)[props.reward_type];
};

var makeSelectIsRewardClaimPending = function makeSelectIsRewardClaimPending() {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectIsClaimRewardPending, function (isClaiming) {
    return isClaiming;
  });
};
var selectClaimErrorsByType = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.claimErrorsByType;
});

var selectClaimRewardError = function selectClaimRewardError(state, props) {
  return selectClaimErrorsByType(state, props)[props.reward_type];
};

var makeSelectClaimRewardError = function makeSelectClaimRewardError() {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectClaimRewardError, function (errorMessage) {
    return errorMessage;
  });
};

var selectRewardByType = function selectRewardByType(state, rewardType) {
  return selectUnclaimedRewards(state).find(function (reward) {
    return reward.reward_type === rewardType;
  });
};

var makeSelectRewardByType = function makeSelectRewardByType() {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectRewardByType, function (reward) {
    return reward;
  });
};

var selectRewardByClaimCode = function selectRewardByClaimCode(state, claimCode) {
  return selectUnclaimedRewards(state).find(function (reward) {
    return reward.claim_code === claimCode;
  });
};

var makeSelectRewardByClaimCode = function makeSelectRewardByClaimCode() {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectRewardByClaimCode, function (reward) {
    return reward;
  });
};
var makeSelectRewardAmountByType = function makeSelectRewardAmountByType() {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectRewardByType, function (reward) {
    return reward ? reward.reward_amount : 0;
  });
};
var selectRewardContentClaimIds = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.rewardedContentClaimIds;
});
var selectReferralReward = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUnclaimedRewards, function (unclaimedRewards) {
  return unclaimedRewards.filter(function (reward) {
    return reward.reward_type === rewards__WEBPACK_IMPORTED_MODULE_1__["default"].TYPE_REFERRAL;
  })[0];
});

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectState", function() { return selectState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectAuthenticationIsPending", function() { return selectAuthenticationIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserIsPending", function() { return selectUserIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUser", function() { return selectUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectEmailAlreadyExists", function() { return selectEmailAlreadyExists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectEmailDoesNotExist", function() { return selectEmailDoesNotExist; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectResendingVerificationEmail", function() { return selectResendingVerificationEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserEmail", function() { return selectUserEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserPhone", function() { return selectUserPhone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserCountryCode", function() { return selectUserCountryCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectEmailToVerify", function() { return selectEmailToVerify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPhoneToVerify", function() { return selectPhoneToVerify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectYoutubeChannels", function() { return selectYoutubeChannels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserIsRewardApproved", function() { return selectUserIsRewardApproved; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectEmailNewIsPending", function() { return selectEmailNewIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectEmailNewErrorMessage", function() { return selectEmailNewErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPasswordExists", function() { return selectPasswordExists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPasswordResetIsPending", function() { return selectPasswordResetIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPasswordResetSuccess", function() { return selectPasswordResetSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPasswordResetError", function() { return selectPasswordResetError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPasswordSetIsPending", function() { return selectPasswordSetIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPasswordSetSuccess", function() { return selectPasswordSetSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPasswordSetError", function() { return selectPasswordSetError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPhoneNewErrorMessage", function() { return selectPhoneNewErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectEmailVerifyIsPending", function() { return selectEmailVerifyIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectEmailVerifyErrorMessage", function() { return selectEmailVerifyErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPhoneNewIsPending", function() { return selectPhoneNewIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPhoneVerifyIsPending", function() { return selectPhoneVerifyIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectPhoneVerifyErrorMessage", function() { return selectPhoneVerifyErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectIdentityVerifyIsPending", function() { return selectIdentityVerifyIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectIdentityVerifyErrorMessage", function() { return selectIdentityVerifyErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserVerifiedEmail", function() { return selectUserVerifiedEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserIsVerificationCandidate", function() { return selectUserIsVerificationCandidate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectAccessToken", function() { return selectAccessToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteStatusIsPending", function() { return selectUserInviteStatusIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserInvitesRemaining", function() { return selectUserInvitesRemaining; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserInvitees", function() { return selectUserInvitees; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteStatusFailed", function() { return selectUserInviteStatusFailed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteNewIsPending", function() { return selectUserInviteNewIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteNewErrorMessage", function() { return selectUserInviteNewErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteReferralLink", function() { return selectUserInviteReferralLink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUserInviteReferralCode", function() { return selectUserInviteReferralCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectYouTubeImportPending", function() { return selectYouTubeImportPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectYouTubeImportError", function() { return selectYouTubeImportError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSetReferrerPending", function() { return selectSetReferrerPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSetReferrerError", function() { return selectSetReferrerError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectYouTubeImportVideosComplete", function() { return selectYouTubeImportVideosComplete; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }


var selectState = function selectState(state) {
  return state.user || {};
};
var selectAuthenticationIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.authenticationIsPending;
});
var selectUserIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.userIsPending;
});
var selectUser = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.user;
});
var selectEmailAlreadyExists = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.emailAlreadyExists;
});
var selectEmailDoesNotExist = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.emailDoesNotExist;
});
var selectResendingVerificationEmail = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.resendingVerificationEmail;
});
var selectUserEmail = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUser, function (user) {
  return user ? user.primary_email || user.latest_claimed_email : null;
});
var selectUserPhone = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUser, function (user) {
  return user ? user.phone_number : null;
});
var selectUserCountryCode = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUser, function (user) {
  return user ? user.country_code : null;
});
var selectEmailToVerify = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectUserEmail, function (state, userEmail) {
  return state.emailToVerify || userEmail;
});
var selectPhoneToVerify = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectUserPhone, function (state, userPhone) {
  return state.phoneToVerify || userPhone;
});
var selectYoutubeChannels = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUser, function (user) {
  return user ? user.youtube_channels : null;
});
var selectUserIsRewardApproved = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUser, function (user) {
  return user && user.is_reward_approved;
});
var selectEmailNewIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.emailNewIsPending;
});
var selectEmailNewErrorMessage = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  var error = state.emailNewErrorMessage;
  return _typeof(error) === 'object' && error !== null ? error.message : error;
});
var selectPasswordExists = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.passwordExistsForUser;
});
var selectPasswordResetIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.passwordResetPending;
});
var selectPasswordResetSuccess = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.passwordResetSuccess;
});
var selectPasswordResetError = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  var error = state.passwordResetError;
  return _typeof(error) === 'object' && error !== null ? error.message : error;
});
var selectPasswordSetIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.passwordSetPending;
});
var selectPasswordSetSuccess = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.passwordSetSuccess;
});
var selectPasswordSetError = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  var error = state.passwordSetError;
  return _typeof(error) === 'object' && error !== null ? error.message : error;
});
var selectPhoneNewErrorMessage = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.phoneNewErrorMessage;
});
var selectEmailVerifyIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.emailVerifyIsPending;
});
var selectEmailVerifyErrorMessage = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.emailVerifyErrorMessage;
});
var selectPhoneNewIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.phoneNewIsPending;
});
var selectPhoneVerifyIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.phoneVerifyIsPending;
});
var selectPhoneVerifyErrorMessage = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.phoneVerifyErrorMessage;
});
var selectIdentityVerifyIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.identityVerifyIsPending;
});
var selectIdentityVerifyErrorMessage = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.identityVerifyErrorMessage;
});
var selectUserVerifiedEmail = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUser, function (user) {
  return user && user.has_verified_email;
});
var selectUserIsVerificationCandidate = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUser, function (user) {
  return user && (!user.has_verified_email || !user.is_identity_verified);
});
var selectAccessToken = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.accessToken;
});
var selectUserInviteStatusIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.inviteStatusIsPending;
});
var selectUserInvitesRemaining = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.invitesRemaining;
});
var selectUserInvitees = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.invitees;
});
var selectUserInviteStatusFailed = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectUserInvitesRemaining, function () {
  return selectUserInvitesRemaining === null;
});
var selectUserInviteNewIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.inviteNewIsPending;
});
var selectUserInviteNewErrorMessage = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.inviteNewErrorMessage;
});
var selectUserInviteReferralLink = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.referralLink;
});
var selectUserInviteReferralCode = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.referralCode ? state.referralCode[0] : '';
});
var selectYouTubeImportPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.youtubeChannelImportPending;
});
var selectYouTubeImportError = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.youtubeChannelImportErrorMessage;
});
var selectSetReferrerPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.referrerSetIsPending;
});
var selectSetReferrerError = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.referrerSetError;
});
var selectYouTubeImportVideosComplete = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  var total = state.youtubeChannelImportTotal;
  var complete = state.youtubeChannelImportComplete || 0;

  if (total) {
    return [complete, total];
  }
});

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchInviteStatus", function() { return doFetchInviteStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doInstallNew", function() { return doInstallNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doInstallNewWithParams", function() { return doInstallNewWithParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doAuthenticate", function() { return doAuthenticate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserFetch", function() { return doUserFetch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserCheckEmailVerified", function() { return doUserCheckEmailVerified; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserPhoneReset", function() { return doUserPhoneReset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserPhoneNew", function() { return doUserPhoneNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserPhoneVerifyFailure", function() { return doUserPhoneVerifyFailure; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserPhoneVerify", function() { return doUserPhoneVerify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserEmailToVerify", function() { return doUserEmailToVerify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserEmailNew", function() { return doUserEmailNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserCheckIfEmailExists", function() { return doUserCheckIfEmailExists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserSignIn", function() { return doUserSignIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserSignUp", function() { return doUserSignUp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserPasswordReset", function() { return doUserPasswordReset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserPasswordSet", function() { return doUserPasswordSet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserResendVerificationEmail", function() { return doUserResendVerificationEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doClearEmailEntry", function() { return doClearEmailEntry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doClearPasswordEntry", function() { return doClearPasswordEntry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserEmailVerifyFailure", function() { return doUserEmailVerifyFailure; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserEmailVerify", function() { return doUserEmailVerify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchAccessToken", function() { return doFetchAccessToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserIdentityVerify", function() { return doUserIdentityVerify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserInviteNew", function() { return doUserInviteNew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserSetReferrerReset", function() { return doUserSetReferrerReset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUserSetReferrer", function() { return doUserSetReferrer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doClaimYoutubeChannels", function() { return doClaimYoutubeChannels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doCheckYoutubeTransfer", function() { return doCheckYoutubeTransfer; });
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var redux_actions_rewards__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(24);
/* harmony import */ var redux_selectors_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(26);
/* harmony import */ var rewards__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







function doFetchInviteStatus() {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_INVITE_STATUS_FETCH_STARTED"]
    });
    Promise.all([lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user', 'invite_status'), lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user_referral_code', 'list')]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          status = _ref2[0],
          code = _ref2[1];

      dispatch(Object(redux_actions_rewards__WEBPACK_IMPORTED_MODULE_2__["doRewardList"])());
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_INVITE_STATUS_FETCH_SUCCESS"],
        data: {
          invitesRemaining: status.invites_remaining ? status.invites_remaining : 0,
          invitees: status.invitees,
          referralLink: "".concat(lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].CONNECTION_STRING, "user/refer?r=").concat(code),
          referralCode: code
        }
      });
    })["catch"](function (error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_INVITE_STATUS_FETCH_FAILURE"],
        data: {
          error: error
        }
      });
    });
  };
}
function doInstallNew(appVersion) {
  var os = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var firebaseToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var callbackForUsersWhoAreSharingData = arguments.length > 3 ? arguments[3] : undefined;
  var payload = {
    app_version: appVersion
  };

  if (firebaseToken) {
    payload.firebase_token = firebaseToken;
  }

  lbry_redux__WEBPACK_IMPORTED_MODULE_0__["Lbry"].status().then(function (status) {
    payload.app_id = status.installation_id;
    payload.node_id = status.lbry_id;
    lbry_redux__WEBPACK_IMPORTED_MODULE_0__["Lbry"].version().then(function (version) {
      payload.daemon_version = version.lbrynet_version;
      payload.operating_system = os || version.os_system;
      payload.platform = version.platform;
      lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('install', 'new', payload);

      if (callbackForUsersWhoAreSharingData) {
        callbackForUsersWhoAreSharingData(status);
      }
    });
  });
}
function doInstallNewWithParams(appVersion, installationId, nodeId, lbrynetVersion, os, platform) {
  var firebaseToken = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  return function () {
    var payload = {
      app_version: appVersion
    };

    if (firebaseToken) {
      payload.firebase_token = firebaseToken;
    }

    payload.app_id = installationId;
    payload.node_id = nodeId;
    payload.daemon_version = lbrynetVersion;
    payload.operating_system = os;
    payload.platform = platform;
    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('install', 'new', payload);
  };
} // TODO: Call doInstallNew separately so we don't have to pass appVersion and os_system params?

function doAuthenticate(appVersion) {
  var os = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var firebaseToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var shareUsageData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var callbackForUsersWhoAreSharingData = arguments.length > 4 ? arguments[4] : undefined;
  var callInstall = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["AUTHENTICATION_STARTED"]
    });
    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].authenticate().then(function (user) {
      lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].getAuthToken().then(function (token) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["AUTHENTICATION_SUCCESS"],
          data: {
            user: user,
            accessToken: token
          }
        });

        if (shareUsageData) {
          dispatch(Object(redux_actions_rewards__WEBPACK_IMPORTED_MODULE_2__["doRewardList"])());
          dispatch(doFetchInviteStatus());

          if (callInstall) {
            doInstallNew(appVersion, os, firebaseToken, callbackForUsersWhoAreSharingData);
          }
        }
      });
    })["catch"](function (error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["AUTHENTICATION_FAILURE"],
        data: {
          error: error
        }
      });
    });
  };
}
function doUserFetch() {
  return function (dispatch) {
    return new Promise(function (resolve, reject) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_FETCH_STARTED"]
      });
      lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].getCurrentUser().then(function (user) {
        dispatch(Object(redux_actions_rewards__WEBPACK_IMPORTED_MODULE_2__["doRewardList"])());
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_FETCH_SUCCESS"],
          data: {
            user: user
          }
        });
        resolve(user);
      })["catch"](function (error) {
        reject(error);
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_FETCH_FAILURE"],
          data: {
            error: error
          }
        });
      });
    });
  };
}
function doUserCheckEmailVerified() {
  // This will happen in the background so we don't need loading booleans
  return function (dispatch) {
    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].getCurrentUser().then(function (user) {
      if (user.has_verified_email) {
        dispatch(Object(redux_actions_rewards__WEBPACK_IMPORTED_MODULE_2__["doRewardList"])());
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_FETCH_SUCCESS"],
          data: {
            user: user
          }
        });
      }
    });
  };
}
function doUserPhoneReset() {
  return {
    type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PHONE_RESET"]
  };
}
function doUserPhoneNew(phone, countryCode) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PHONE_NEW_STARTED"],
      data: {
        phone: phone,
        country_code: countryCode
      }
    });

    var success = function success() {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PHONE_NEW_SUCCESS"],
        data: {
          phone: phone
        }
      });
    };

    var failure = function failure(error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PHONE_NEW_FAILURE"],
        data: {
          error: error
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user', 'phone_number_new', {
      phone_number: phone,
      country_code: countryCode
    }, 'post').then(success, failure);
  };
}
function doUserPhoneVerifyFailure(error) {
  return {
    type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PHONE_VERIFY_FAILURE"],
    data: {
      error: error
    }
  };
}
function doUserPhoneVerify(verificationCode) {
  return function (dispatch, getState) {
    var phoneNumber = Object(redux_selectors_user__WEBPACK_IMPORTED_MODULE_3__["selectPhoneToVerify"])(getState());
    var countryCode = Object(redux_selectors_user__WEBPACK_IMPORTED_MODULE_3__["selectUserCountryCode"])(getState());
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PHONE_VERIFY_STARTED"],
      code: verificationCode
    });
    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user', 'phone_number_confirm', {
      verification_code: verificationCode,
      phone_number: phoneNumber,
      country_code: countryCode
    }, 'post').then(function (user) {
      if (user.is_identity_verified) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PHONE_VERIFY_SUCCESS"],
          data: {
            user: user
          }
        });
        dispatch(Object(redux_actions_rewards__WEBPACK_IMPORTED_MODULE_2__["doClaimRewardType"])(rewards__WEBPACK_IMPORTED_MODULE_4__["default"].TYPE_NEW_USER));
      }
    })["catch"](function (error) {
      return dispatch(doUserPhoneVerifyFailure(error));
    });
  };
}
function doUserEmailToVerify(email) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_VERIFY_SET"],
      data: {
        email: email
      }
    });
  };
}
function doUserEmailNew(email) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_STARTED"],
      email: email
    });

    var success = function success() {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_SUCCESS"],
        data: {
          email: email
        }
      });
      dispatch(doUserFetch());
    };

    var failure = function failure(error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_FAILURE"],
        data: {
          error: error
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user_email', 'new', {
      email: email,
      send_verification_email: true
    }, 'post')["catch"](function (error) {
      if (error.response && error.response.status === 409) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_EXISTS"]
        });
        return lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user_email', 'resend_token', {
          email: email,
          only_if_expired: true
        }, 'post').then(success, failure);
      }

      throw error;
    }).then(success, failure);
  };
}
function doUserCheckIfEmailExists(email) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_STARTED"],
      email: email
    });

    var triggerEmailFlow = function triggerEmailFlow(hasPassword) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_SUCCESS"],
        data: {
          email: email
        }
      });
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_EXISTS"]
      });

      if (hasPassword) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PASSWORD_EXISTS"]
        });
      } else {
        // If they don't have a password, they will need to use the email verification api
        lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user_email', 'resend_token', {
          email: email,
          only_if_expired: true
        }, 'post');
      }
    };

    var success = function success(response) {
      triggerEmailFlow(response.has_password);
    };

    var failure = function failure(error) {
      return dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_FAILURE"],
        data: {
          error: error
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user', 'exists', {
      email: email
    }, 'post')["catch"](function (error) {
      if (error.response && error.response.status === 404) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_DOES_NOT_EXIST"]
        });
      } else if (error.response && error.response.status === 412) {
        triggerEmailFlow(false);
      }

      throw error;
    }).then(success, failure);
  };
}
function doUserSignIn(email, password) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_STARTED"],
      email: email
    });

    var success = function success() {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_SUCCESS"],
        data: {
          email: email
        }
      });
      dispatch(doUserFetch());
    };

    var failure = function failure(error) {
      return dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_FAILURE"],
        data: {
          error: error
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user', 'signin', _objectSpread({
      email: email
    }, password ? {
      password: password
    } : {}), 'post')["catch"](function (error) {
      if (error.response && error.response.status === 409) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_EXISTS"]
        });
        return lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user_email', 'resend_token', {
          email: email,
          only_if_expired: true
        }, 'post').then(success, failure);
      }

      throw error;
    }).then(success, failure);
  };
}
function doUserSignUp(email, password) {
  return function (dispatch) {
    return new Promise(function (resolve, reject) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_STARTED"],
        email: email
      });

      var success = function success() {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_SUCCESS"],
          data: {
            email: email
          }
        });
        dispatch(doUserFetch());
        resolve();
      };

      var failure = function failure(error) {
        if (error.response && error.response.status === 409) {
          dispatch({
            type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_EXISTS"]
          });
        }

        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_FAILURE"],
          data: {
            error: error
          }
        });
        reject(error);
      };

      lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user', 'signup', _objectSpread({
        email: email
      }, password ? {
        password: password
      } : {}), 'post').then(success, failure);
    });
  };
}
function doUserPasswordReset(email) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PASSWORD_RESET_STARTED"],
      email: email
    });

    var success = function success() {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PASSWORD_RESET_SUCCESS"]
      });
    };

    var failure = function failure(error) {
      return dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PASSWORD_RESET_FAILURE"],
        data: {
          error: error
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user_password', 'reset', {
      email: email
    }, 'post').then(success, failure);
  };
}
function doUserPasswordSet(newPassword, oldPassword, authToken) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PASSWORD_SET_STARTED"]
    });

    var success = function success() {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PASSWORD_SET_SUCCESS"]
      });
      dispatch(doUserFetch());
    };

    var failure = function failure(error) {
      return dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PASSWORD_SET_FAILURE"],
        data: {
          error: error
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user_password', 'set', _objectSpread({
      new_password: newPassword
    }, oldPassword ? {
      old_password: oldPassword
    } : {}, authToken ? {
      auth_token: authToken
    } : {}), 'post').then(success, failure);
  };
}
function doUserResendVerificationEmail(email) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_VERIFY_RETRY_STARTED"]
    });

    var success = function success() {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_VERIFY_RETRY_SUCCESS"]
      });
    };

    var failure = function failure(error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_VERIFY_RETRY_FAILURE"],
        data: {
          error: error
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user_email', 'resend_token', {
      email: email
    }, 'post')["catch"](function (error) {
      if (error.response && error.response.status === 409) {
        throw error;
      }
    }).then(success, failure);
  };
}
function doClearEmailEntry() {
  return {
    type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_NEW_CLEAR_ENTRY"]
  };
}
function doClearPasswordEntry() {
  return {
    type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_PASSWORD_SET_CLEAR"]
  };
}
function doUserEmailVerifyFailure(error) {
  return {
    type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_VERIFY_FAILURE"],
    data: {
      error: error
    }
  };
}
function doUserEmailVerify(verificationToken, recaptcha) {
  return function (dispatch, getState) {
    var email = Object(redux_selectors_user__WEBPACK_IMPORTED_MODULE_3__["selectEmailToVerify"])(getState());
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_VERIFY_STARTED"],
      code: verificationToken,
      recaptcha: recaptcha
    });
    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user_email', 'confirm', {
      verification_token: verificationToken,
      email: email,
      recaptcha: recaptcha
    }, 'post').then(function (userEmail) {
      if (userEmail.is_verified) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_EMAIL_VERIFY_SUCCESS"],
          data: {
            email: email
          }
        });
        dispatch(doUserFetch());
      } else {
        throw new Error('Your email is still not verified.'); // shouldn't happen
      }
    })["catch"](function (error) {
      return dispatch(doUserEmailVerifyFailure(error));
    });
  };
}
function doFetchAccessToken() {
  return function (dispatch) {
    var success = function success(token) {
      return dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_ACCESS_TOKEN_SUCCESS"],
        data: {
          token: token
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].getAuthToken().then(success);
  };
}
function doUserIdentityVerify(stripeToken) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_IDENTITY_VERIFY_STARTED"],
      token: stripeToken
    });
    lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user', 'verify_identity', {
      stripe_token: stripeToken
    }, 'post').then(function (user) {
      if (user.is_identity_verified) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_IDENTITY_VERIFY_SUCCESS"],
          data: {
            user: user
          }
        });
        dispatch(Object(redux_actions_rewards__WEBPACK_IMPORTED_MODULE_2__["doClaimRewardType"])(rewards__WEBPACK_IMPORTED_MODULE_4__["default"].TYPE_NEW_USER));
      } else {
        throw new Error('Your identity is still not verified. This should not happen.'); // shouldn't happen
      }
    })["catch"](function (error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_IDENTITY_VERIFY_FAILURE"],
        data: {
          error: error.toString()
        }
      });
    });
  };
}
function doUserInviteNew(email) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_INVITE_NEW_STARTED"]
    });
    return lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user', 'invite', {
      email: email
    }, 'post').then(function (success) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_INVITE_NEW_SUCCESS"],
        data: {
          email: email
        }
      });
      dispatch(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_0__["doToast"])({
        message: __("Invite sent to ".concat(email))
      }));
      dispatch(doFetchInviteStatus());
      return success;
    })["catch"](function (error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_INVITE_NEW_FAILURE"],
        data: {
          error: error
        }
      });
    });
  };
}
function doUserSetReferrerReset() {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_SET_REFERRER_RESET"]
    });
  };
}
function doUserSetReferrer(referrer, shouldClaim) {
  return (
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(dispatch, getState) {
        var claim, referrerCode, _parseURI, isChannel, uri, response;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dispatch({
                  type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_SET_REFERRER_STARTED"]
                });
                _parseURI = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_0__["parseURI"])(referrer), isChannel = _parseURI.isChannel;

                if (!isChannel) {
                  _context.next = 17;
                  break;
                }

                uri = "lbry://".concat(referrer);
                claim = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_0__["makeSelectClaimForUri"])(uri)(getState());

                if (claim) {
                  _context.next = 16;
                  break;
                }

                _context.prev = 6;
                _context.next = 9;
                return lbry_redux__WEBPACK_IMPORTED_MODULE_0__["Lbry"].resolve({
                  urls: [uri]
                });

              case 9:
                response = _context.sent;
                claim = response && response[uri];
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](6);
                dispatch({
                  type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_SET_REFERRER_FAILURE"],
                  data: {
                    error: _context.t0
                  }
                });

              case 16:
                referrerCode = claim && claim.permanent_url && claim.permanent_url.replace('lbry://', '');

              case 17:
                if (!referrerCode) {
                  referrerCode = referrer;
                }

                _context.prev = 18;
                _context.next = 21;
                return lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('user', 'referral', {
                  referrer: referrerCode
                }, 'post');

              case 21:
                dispatch({
                  type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_SET_REFERRER_SUCCESS"]
                });

                if (shouldClaim) {
                  dispatch(Object(redux_actions_rewards__WEBPACK_IMPORTED_MODULE_2__["doClaimRewardType"])(rewards__WEBPACK_IMPORTED_MODULE_4__["default"].TYPE_REFEREE));
                  dispatch(doUserFetch());
                } else {
                  dispatch(doUserFetch());
                }

                _context.next = 28;
                break;

              case 25:
                _context.prev = 25;
                _context.t1 = _context["catch"](18);
                dispatch({
                  type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_SET_REFERRER_FAILURE"],
                  data: {
                    error: _context.t1
                  }
                });

              case 28:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[6, 13], [18, 25]]);
      }));

      return function (_x, _x2) {
        return _ref3.apply(this, arguments);
      };
    }()
  );
}
function doClaimYoutubeChannels() {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_YOUTUBE_IMPORT_STARTED"]
    });
    var transferResponse;
    return lbry_redux__WEBPACK_IMPORTED_MODULE_0__["Lbry"].address_list({
      page: 1,
      page_size: 99999
    }).then(function (addressList) {
      return addressList.items.sort(function (a, b) {
        return a.used_times - b.used_times;
      })[0];
    }).then(function (address) {
      return lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('yt', 'transfer', {
        address: address.address,
        public_key: address.pubkey
      }).then(function (response) {
        if (response && response.length) {
          transferResponse = response;
          return Promise.all(response.map(function (channelMeta) {
            if (channelMeta && channelMeta.channel && channelMeta.channel.channel_certificate) {
              return lbry_redux__WEBPACK_IMPORTED_MODULE_0__["Lbry"].channel_import({
                channel_data: channelMeta.channel.channel_certificate
              });
            }

            return null;
          })).then(function () {
            var actions = [{
              type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_YOUTUBE_IMPORT_SUCCESS"],
              data: transferResponse
            }];
            actions.push(doUserFetch());
            actions.push(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_0__["doFetchChannelListMine"])());
            dispatch(lbry_redux__WEBPACK_IMPORTED_MODULE_0__["batchActions"].apply(void 0, actions));
          });
        }
      });
    })["catch"](function (error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_YOUTUBE_IMPORT_FAILURE"],
        data: String(error)
      });
    });
  };
}
function doCheckYoutubeTransfer() {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_YOUTUBE_IMPORT_STARTED"]
    });
    return lbryio__WEBPACK_IMPORTED_MODULE_5__["default"].call('yt', 'transfer').then(function (response) {
      if (response && response.length) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_YOUTUBE_IMPORT_SUCCESS"],
          data: response
        });
      } else {
        throw new Error();
      }
    })["catch"](function (error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["USER_YOUTUBE_IMPORT_FAILURE"],
        data: String(error)
      });
    });
  };
}

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doSetViewMode", function() { return doSetViewMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSubscriptionLatest", function() { return setSubscriptionLatest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUpdateUnreadSubscriptions", function() { return doUpdateUnreadSubscriptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doRemoveUnreadSubscriptions", function() { return doRemoveUnreadSubscriptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doRemoveUnreadSubscription", function() { return doRemoveUnreadSubscription; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doCheckSubscription", function() { return doCheckSubscription; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doChannelSubscribe", function() { return doChannelSubscribe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doChannelUnsubscribe", function() { return doChannelUnsubscribe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doCheckSubscriptions", function() { return doCheckSubscriptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchMySubscriptions", function() { return doFetchMySubscriptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doCheckSubscriptionsInit", function() { return doCheckSubscriptionsInit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchRecommendedSubscriptions", function() { return doFetchRecommendedSubscriptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doCompleteFirstRun", function() { return doCompleteFirstRun; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doShowSuggestedSubs", function() { return doShowSuggestedSubs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doChannelSubscriptionEnableNotifications", function() { return doChannelSubscriptionEnableNotifications; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doChannelSubscriptionDisableNotifications", function() { return doChannelSubscriptionDisableNotifications; });
/* harmony import */ var constants_claim__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(29);
/* harmony import */ var redux_actions_rewards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
/* harmony import */ var redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1);
/* harmony import */ var constants_subscriptions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4);
/* harmony import */ var rewards__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }









var CHECK_SUBSCRIPTIONS_INTERVAL = 15 * 60 * 1000;
var SUBSCRIPTION_DOWNLOAD_LIMIT = 1;
var doSetViewMode = function doSetViewMode(viewMode) {
  return function (dispatch) {
    return dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["SET_VIEW_MODE"],
      data: viewMode
    });
  };
};
var setSubscriptionLatest = function setSubscriptionLatest(subscription, uri) {
  return function (dispatch) {
    return dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["SET_SUBSCRIPTION_LATEST"],
      data: {
        subscription: subscription,
        uri: uri
      }
    });
  };
}; // Populate a channels unread subscriptions or update the type

var doUpdateUnreadSubscriptions = function doUpdateUnreadSubscriptions(channelUri, uris, type) {
  return function (dispatch, getState) {
    var state = getState();
    var unreadByChannel = Object(redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_2__["selectUnreadByChannel"])(state);
    var currentUnreadForChannel = unreadByChannel[channelUri];
    var newUris = [];
    var newType = null;

    if (!currentUnreadForChannel) {
      newUris = uris;
      newType = type;
    } else {
      if (uris) {
        // If a channel currently has no unread uris, just add them all
        if (!currentUnreadForChannel.uris || !currentUnreadForChannel.uris.length) {
          newUris = uris;
        } else {
          // They already have unreads and now there are new ones
          // Add the new ones to the beginning of the list
          // Make sure there are no duplicates
          var currentUnreadUris = currentUnreadForChannel.uris;
          newUris = uris.filter(function (uri) {
            return !currentUnreadUris.includes(uri);
          }).concat(currentUnreadUris);
        }
      } else {
        newUris = currentUnreadForChannel.uris;
      }

      newType = type || currentUnreadForChannel.type;
    }

    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["UPDATE_SUBSCRIPTION_UNREADS"],
      data: {
        channel: channelUri,
        uris: newUris,
        type: newType
      }
    });
  };
}; // Remove multiple files (or all) from a channels unread subscriptions

var doRemoveUnreadSubscriptions = function doRemoveUnreadSubscriptions(channelUri, readUris) {
  return function (dispatch, getState) {
    var state = getState();
    var unreadByChannel = Object(redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_2__["selectUnreadByChannel"])(state); // If no channel is passed in, remove all unread subscriptions from all channels

    if (!channelUri) {
      return dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["REMOVE_SUBSCRIPTION_UNREADS"],
        data: {
          channel: null
        }
      });
    }

    var currentChannelUnread = unreadByChannel[channelUri];

    if (!currentChannelUnread || !currentChannelUnread.uris) {
      // Channel passed in doesn't have any unreads
      return null;
    } // For each uri passed in, remove it from the list of unread uris
    // If no uris are passed in, remove them all


    var newUris;

    if (readUris) {
      var urisToRemoveMap = readUris.reduce(function (acc, val) {
        return _objectSpread({}, acc, _defineProperty({}, val, true));
      }, {});
      var filteredUris = currentChannelUnread.uris.filter(function (uri) {
        return !urisToRemoveMap[uri];
      });
      newUris = filteredUris.length ? filteredUris : null;
    } else {
      newUris = null;
    }

    return dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["REMOVE_SUBSCRIPTION_UNREADS"],
      data: {
        channel: channelUri,
        uris: newUris
      }
    });
  };
}; // Remove a single file from a channels unread subscriptions

var doRemoveUnreadSubscription = function doRemoveUnreadSubscription(channelUri, readUri) {
  return function (dispatch) {
    dispatch(doRemoveUnreadSubscriptions(channelUri, [readUri]));
  };
};
var doCheckSubscription = function doCheckSubscription(subscriptionUri, shouldNotify) {
  return function (dispatch, getState) {
    // no dispatching FETCH_CHANNEL_CLAIMS_STARTED; causes loading issues on <SubscriptionsPage>
    var state = getState();
    var shouldAutoDownload = false; // makeSelectClientSetting(SETTINGS.AUTO_DOWNLOAD)(state);

    var savedSubscription = state.subscriptions.subscriptions.find(function (sub) {
      return sub.uri === subscriptionUri;
    });
    var subscriptionLatest = state.subscriptions.latest[subscriptionUri];

    if (!savedSubscription) {
      throw Error("Trying to find new content for ".concat(subscriptionUri, " but it doesn't exist in your subscriptions"));
    } // We may be duplicating calls here. Can this logic be baked into doFetchClaimsByChannel?


    lbry_redux__WEBPACK_IMPORTED_MODULE_3__["Lbry"].claim_search({
      channel: subscriptionUri,
      valid_channel_signature: true,
      order_by: ['release_time'],
      page: 1,
      page_size: constants_claim__WEBPACK_IMPORTED_MODULE_0__["PAGE_SIZE"]
    }).then(function (claimListByChannel) {
      var claimsInChannel = claimListByChannel.items; // may happen if subscribed to an abandoned channel or an empty channel

      if (!claimsInChannel || !claimsInChannel.length) {
        return;
      } // Determine if the latest subscription currently saved is actually the latest subscription


      var latestIndex = claimsInChannel.findIndex(function (claim) {
        return claim.permanent_url === subscriptionLatest;
      }); // If latest is -1, it is a newly subscribed channel or there have been 10+ claims published since last viewed

      var latestIndexToNotify = latestIndex === -1 ? 10 : latestIndex; // If latest is 0, nothing has changed
      // Do not download/notify about new content, it would download/notify 10 claims per channel

      if (latestIndex !== 0 && subscriptionLatest) {
        var downloadCount = 0;
        var newUnread = [];
        claimsInChannel.slice(0, latestIndexToNotify).forEach(function (claim) {
          var uri = claim.permanent_url;
          var shouldDownload = shouldAutoDownload && Boolean(downloadCount < SUBSCRIPTION_DOWNLOAD_LIMIT && !claim.value.fee); // Add the new content to the list of "un-read" subscriptions

          if (shouldNotify) {
            newUnread.push(uri);
          }

          if (shouldDownload) {
            downloadCount += 1;
            dispatch(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_3__["doPurchaseUri"])(uri, {
              cost: 0
            }, true));
          }
        });
        dispatch(doUpdateUnreadSubscriptions(subscriptionUri, newUnread, downloadCount > 0 ? constants_subscriptions__WEBPACK_IMPORTED_MODULE_5__["DOWNLOADING"] : constants_subscriptions__WEBPACK_IMPORTED_MODULE_5__["NOTIFY_ONLY"]));
      } // Set the latest piece of content for a channel
      // This allows the app to know if there has been new content since it was last set


      var latest = claimsInChannel[0];
      dispatch(setSubscriptionLatest({
        channelName: latest.signing_channel.name,
        uri: latest.signing_channel.permanent_url
      }, latest.permanent_url)); // calling FETCH_CHANNEL_CLAIMS_COMPLETED after not calling STARTED
      // means it will delete a non-existant fetchingChannelClaims[uri]

      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["FETCH_CHANNEL_CLAIMS_COMPLETED"],
        data: {
          uri: subscriptionUri,
          claims: claimsInChannel || [],
          page: 1
        }
      });
    });
  };
};
var doChannelSubscribe = function doChannelSubscribe(subscription) {
  return function (dispatch, getState) {
    var _getState = getState(),
        daemonSettings = _getState.settings.daemonSettings;

    var isSharingData = daemonSettings ? daemonSettings.share_usage_data : true;
    var subscriptionUri = subscription.uri;

    if (!subscriptionUri.startsWith('lbry://')) {
      throw Error("Subscription uris must inclue the \"lbry://\" prefix.\nTried to subscribe to ".concat(subscriptionUri));
    }

    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["CHANNEL_SUBSCRIBE"],
      data: subscription
    }); // if the user isn't sharing data, keep the subscriptions entirely in the app

    if (isSharingData) {
      var _parseURI = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_3__["parseURI"])(subscription.uri),
          channelClaimId = _parseURI.channelClaimId; // They are sharing data, we can store their subscriptions in our internal database


      lbryio__WEBPACK_IMPORTED_MODULE_6__["default"].call('subscription', 'new', {
        channel_name: subscription.channelName,
        claim_id: channelClaimId
      });
      dispatch(Object(redux_actions_rewards__WEBPACK_IMPORTED_MODULE_1__["doClaimRewardType"])(rewards__WEBPACK_IMPORTED_MODULE_7__["default"].TYPE_SUBSCRIPTION, {
        failSilently: true
      }));
    }

    dispatch(doCheckSubscription(subscription.uri, true));
  };
};
var doChannelUnsubscribe = function doChannelUnsubscribe(subscription) {
  return function (dispatch, getState) {
    var _getState2 = getState(),
        daemonSettings = _getState2.settings.daemonSettings;

    var isSharingData = daemonSettings ? daemonSettings.share_usage_data : true;
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["CHANNEL_UNSUBSCRIBE"],
      data: subscription
    });

    if (isSharingData) {
      var _parseURI2 = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_3__["parseURI"])(subscription.uri),
          channelClaimId = _parseURI2.channelClaimId;

      lbryio__WEBPACK_IMPORTED_MODULE_6__["default"].call('subscription', 'delete', {
        claim_id: channelClaimId
      });
    }
  };
};
var doCheckSubscriptions = function doCheckSubscriptions() {
  return function (dispatch, getState) {
    var state = getState();
    var subscriptions = Object(redux_selectors_subscriptions__WEBPACK_IMPORTED_MODULE_2__["selectSubscriptions"])(state);
    subscriptions.forEach(function (sub) {
      dispatch(doCheckSubscription(sub.uri, true));
    });
  };
};
var doFetchMySubscriptions = function doFetchMySubscriptions() {
  return function (dispatch, getState) {
    var state = getState();
    var reduxSubscriptions = state.subscriptions.subscriptions; // default to true if daemonSettings not found

    var isSharingData = state.settings && state.settings.daemonSettings ? state.settings.daemonSettings.share_usage_data : true;

    if (!isSharingData && isSharingData !== undefined) {
      // They aren't sharing their data, subscriptions will be handled by persisted redux state
      return;
    } // most of this logic comes from scenarios where the db isn't synced with redux
    // this will happen if the user stops sharing data


    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["FETCH_SUBSCRIPTIONS_START"]
    });
    lbryio__WEBPACK_IMPORTED_MODULE_6__["default"].call('subscription', 'list').then(function (dbSubscriptions) {
      var storedSubscriptions = dbSubscriptions || []; // User has no subscriptions in db or redux

      if (!storedSubscriptions.length && (!reduxSubscriptions || !reduxSubscriptions.length)) {
        return [];
      } // There is some mismatch between redux state and db state
      // If something is in the db, but not in redux, add it to redux
      // If something is in redux, but not in the db, add it to the db


      if (storedSubscriptions.length !== reduxSubscriptions.length) {
        var dbSubMap = {};
        var reduxSubMap = {};
        var subsNotInDB = [];
        var subscriptionsToReturn = reduxSubscriptions.slice();
        storedSubscriptions.forEach(function (sub) {
          dbSubMap[sub.claim_id] = 1;
        });
        reduxSubscriptions.forEach(function (sub) {
          var _parseURI3 = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_3__["parseURI"])(sub.uri),
              channelClaimId = _parseURI3.channelClaimId;

          reduxSubMap[channelClaimId] = 1;
        });
        storedSubscriptions.forEach(function (sub) {
          if (!reduxSubMap[sub.claim_id]) {
            var uri = "lbry://".concat(sub.channel_name, "#").concat(sub.claim_id);
            subscriptionsToReturn.push({
              uri: uri,
              channelName: sub.channel_name
            });
          }
        });
        return Promise.all(subsNotInDB.map(function (payload) {
          return lbryio__WEBPACK_IMPORTED_MODULE_6__["default"].call('subscription', 'new', payload);
        })).then(function () {
          return subscriptionsToReturn;
        })["catch"](function () {
          return (// let it fail, we will try again when the navigate to the subscriptions page
            subscriptionsToReturn
          );
        });
      } // DB is already synced, just return the subscriptions in redux


      return reduxSubscriptions;
    }).then(function (subscriptions) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["FETCH_SUBSCRIPTIONS_SUCCESS"],
        data: subscriptions
      });
      dispatch(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_3__["doResolveUris"])(subscriptions.map(function (_ref) {
        var uri = _ref.uri;
        return uri;
      })));
      dispatch(doCheckSubscriptions());
    })["catch"](function () {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["FETCH_SUBSCRIPTIONS_FAIL"]
      });
    });
  };
};
var doCheckSubscriptionsInit = function doCheckSubscriptionsInit() {
  return function (dispatch) {
    // doCheckSubscriptionsInit is called by doDaemonReady
    // setTimeout below is a hack to ensure redux is hydrated when subscriptions are checked
    // this will be replaced with <PersistGate> which reqiures a package upgrade
    setTimeout(function () {
      return dispatch(doFetchMySubscriptions());
    }, 5000);
    var checkSubscriptionsTimer = setInterval(function () {
      return dispatch(doCheckSubscriptions());
    }, CHECK_SUBSCRIPTIONS_INTERVAL);
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["CHECK_SUBSCRIPTIONS_SUBSCRIBE"],
      data: {
        checkSubscriptionsTimer: checkSubscriptionsTimer
      }
    });
    setInterval(function () {
      return dispatch(doCheckSubscriptions());
    }, CHECK_SUBSCRIPTIONS_INTERVAL);
  };
};
var doFetchRecommendedSubscriptions = function doFetchRecommendedSubscriptions() {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["GET_SUGGESTED_SUBSCRIPTIONS_START"]
    });
    return lbryio__WEBPACK_IMPORTED_MODULE_6__["default"].call('subscription', 'suggest').then(function (suggested) {
      return dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["GET_SUGGESTED_SUBSCRIPTIONS_SUCCESS"],
        data: suggested
      });
    })["catch"](function (error) {
      return dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["GET_SUGGESTED_SUBSCRIPTIONS_FAIL"],
        error: error
      });
    });
  };
};
var doCompleteFirstRun = function doCompleteFirstRun() {
  return function (dispatch) {
    return dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["SUBSCRIPTION_FIRST_RUN_COMPLETED"]
    });
  };
};
var doShowSuggestedSubs = function doShowSuggestedSubs() {
  return function (dispatch) {
    return dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["VIEW_SUGGESTED_SUBSCRIPTIONS"]
    });
  };
};
var doChannelSubscriptionEnableNotifications = function doChannelSubscriptionEnableNotifications(channelName) {
  return function (dispatch) {
    return dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["CHANNEL_SUBSCRIPTION_ENABLE_NOTIFICATIONS"],
      data: channelName
    });
  };
};
var doChannelSubscriptionDisableNotifications = function doChannelSubscriptionDisableNotifications(channelName) {
  return function (dispatch) {
    return dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_4__["CHANNEL_SUBSCRIPTION_DISABLE_NOTIFICATIONS"],
      data: channelName
    });
  };
};

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MINIMUM_PUBLISH_BID", function() { return MINIMUM_PUBLISH_BID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANNEL_ANONYMOUS", function() { return CHANNEL_ANONYMOUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHANNEL_NEW", function() { return CHANNEL_NEW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PAGE_SIZE", function() { return PAGE_SIZE; });
var MINIMUM_PUBLISH_BID = 0.00000001;
var CHANNEL_ANONYMOUS = 'anonymous';
var CHANNEL_NEW = 'new';
var PAGE_SIZE = 20;

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchCostInfoForUri", function() { return doFetchCostInfoForUri; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_2__);


 // eslint-disable-next-line import/prefer-default-export

function doFetchCostInfoForUri(uri) {
  return function (dispatch, getState) {
    var state = getState();
    var claim = Object(lbry_redux__WEBPACK_IMPORTED_MODULE_2__["selectClaimsByUri"])(state)[uri];
    if (!claim) return;

    function resolve(costInfo) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_COST_INFO_COMPLETED"],
        data: {
          uri: uri,
          costInfo: costInfo
        }
      });
    }

    var fee = claim.value ? claim.value.fee : undefined;

    if (fee === undefined) {
      resolve({
        cost: 0,
        includesData: true
      });
    } else if (fee.currency === 'LBC') {
      resolve({
        cost: fee.amount,
        includesData: true
      });
    } else {
      lbryio__WEBPACK_IMPORTED_MODULE_1__["default"].getExchangeRates().then(function (_ref) {
        var LBC_USD = _ref.LBC_USD;
        resolve({
          cost: fee.amount / LBC_USD,
          includesData: true
        });
      });
    }
  };
}

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchBlackListedOutpoints", function() { return doFetchBlackListedOutpoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doBlackListedOutpointsSubscribe", function() { return doBlackListedOutpointsSubscribe; });
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var CHECK_BLACK_LISTED_CONTENT_INTERVAL = 60 * 60 * 1000;
function doFetchBlackListedOutpoints() {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_BLACK_LISTED_CONTENT_STARTED"]
    });

    var success = function success(_ref) {
      var outpoints = _ref.outpoints;
      var splitOutpoints = [];

      if (outpoints) {
        outpoints.forEach(function (outpoint, index) {
          var _outpoint$split = outpoint.split(':'),
              _outpoint$split2 = _slicedToArray(_outpoint$split, 2),
              txid = _outpoint$split2[0],
              nout = _outpoint$split2[1];

          splitOutpoints[index] = {
            txid: txid,
            nout: Number.parseInt(nout, 10)
          };
        });
      }

      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_BLACK_LISTED_CONTENT_COMPLETED"],
        data: {
          outpoints: splitOutpoints,
          success: true
        }
      });
    };

    var failure = function failure(_ref2) {
      var error = _ref2.error;
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_BLACK_LISTED_CONTENT_FAILED"],
        data: {
          error: error,
          success: false
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_0__["default"].call('file', 'list_blocked').then(success, failure);
  };
}
function doBlackListedOutpointsSubscribe() {
  return function (dispatch) {
    dispatch(doFetchBlackListedOutpoints());
    setInterval(function () {
      return dispatch(doFetchBlackListedOutpoints());
    }, CHECK_BLACK_LISTED_CONTENT_INTERVAL);
  };
}

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchFilteredOutpoints", function() { return doFetchFilteredOutpoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFilteredOutpointsSubscribe", function() { return doFilteredOutpointsSubscribe; });
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var CHECK_FILTERED_CONTENT_INTERVAL = 60 * 60 * 1000;
function doFetchFilteredOutpoints() {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_FILTERED_CONTENT_STARTED"]
    });

    var success = function success(_ref) {
      var outpoints = _ref.outpoints;
      var formattedOutpoints = [];

      if (outpoints) {
        formattedOutpoints = outpoints.map(function (outpoint) {
          var _outpoint$split = outpoint.split(':'),
              _outpoint$split2 = _slicedToArray(_outpoint$split, 2),
              txid = _outpoint$split2[0],
              nout = _outpoint$split2[1];

          return {
            txid: txid,
            nout: Number.parseInt(nout, 10)
          };
        });
      }

      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_FILTERED_CONTENT_COMPLETED"],
        data: {
          outpoints: formattedOutpoints
        }
      });
    };

    var failure = function failure(_ref2) {
      var error = _ref2.error;
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_FILTERED_CONTENT_FAILED"],
        data: {
          error: error
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_0__["default"].call('file', 'list_filtered').then(success, failure);
  };
}
function doFilteredOutpointsSubscribe() {
  return function (dispatch) {
    dispatch(doFetchFilteredOutpoints());
    setInterval(function () {
      return dispatch(doFetchFilteredOutpoints());
    }, CHECK_FILTERED_CONTENT_INTERVAL);
  };
}

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchFeaturedUris", function() { return doFetchFeaturedUris; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchTrendingUris", function() { return doFetchTrendingUris; });
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }




function doFetchFeaturedUris() {
  var offloadResolve = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_2__["FETCH_FEATURED_CONTENT_STARTED"]
    });

    var success = function success(_ref) {
      var Uris = _ref.Uris;
      var urisToResolve = [];
      Object.keys(Uris).forEach(function (category) {
        urisToResolve = [].concat(_toConsumableArray(urisToResolve), _toConsumableArray(Uris[category]));
      });
      var actions = [{
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_2__["FETCH_FEATURED_CONTENT_COMPLETED"],
        data: {
          uris: Uris,
          success: true
        }
      }];

      if (urisToResolve.length && !offloadResolve) {
        actions.push(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_1__["doResolveUris"])(urisToResolve));
      }

      dispatch(lbry_redux__WEBPACK_IMPORTED_MODULE_1__["batchActions"].apply(void 0, actions));
    };

    var failure = function failure() {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_2__["FETCH_FEATURED_CONTENT_COMPLETED"],
        data: {
          uris: {}
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_0__["default"].call('file', 'list_homepage').then(success, failure);
  };
}
function doFetchTrendingUris() {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_2__["FETCH_TRENDING_CONTENT_STARTED"]
    });

    var success = function success(data) {
      var urisToResolve = data.map(function (uri) {
        return uri.url;
      });
      var actions = [Object(lbry_redux__WEBPACK_IMPORTED_MODULE_1__["doResolveUris"])(urisToResolve), {
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_2__["FETCH_TRENDING_CONTENT_COMPLETED"],
        data: {
          uris: data,
          success: true
        }
      }];
      dispatch(lbry_redux__WEBPACK_IMPORTED_MODULE_1__["batchActions"].apply(void 0, actions));
    };

    var failure = function failure() {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_2__["FETCH_TRENDING_CONTENT_COMPLETED"],
        data: {
          uris: []
        }
      });
    };

    lbryio__WEBPACK_IMPORTED_MODULE_0__["default"].call('file', 'list_trending').then(success, failure);
  };
}

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchViewCount", function() { return doFetchViewCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doFetchSubCount", function() { return doFetchSubCount; });
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);


var doFetchViewCount = function doFetchViewCount(claimId) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_VIEW_COUNT_STARTED"]
    });
    return lbryio__WEBPACK_IMPORTED_MODULE_0__["default"].call('file', 'view_count', {
      claim_id: claimId
    }).then(function (result) {
      var viewCount = result[0];
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_VIEW_COUNT_COMPLETED"],
        data: {
          claimId: claimId,
          viewCount: viewCount
        }
      });
    })["catch"](function (error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_VIEW_COUNT_FAILED"],
        data: error
      });
    });
  };
};
var doFetchSubCount = function doFetchSubCount(claimId) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_SUB_COUNT_STARTED"]
    });
    return lbryio__WEBPACK_IMPORTED_MODULE_0__["default"].call('subscription', 'sub_count', {
      claim_id: claimId
    }).then(function (result) {
      var subCount = result[0];
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_SUB_COUNT_COMPLETED"],
        data: {
          claimId: claimId,
          subCount: subCount
        }
      });
    })["catch"](function (error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_SUB_COUNT_FAILED"],
        data: error
      });
    });
  };
};

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doSetDefaultAccount", function() { return doSetDefaultAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doSetSync", function() { return doSetSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doGetSync", function() { return doGetSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doSyncApply", function() { return doSyncApply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doCheckSync", function() { return doCheckSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doResetSync", function() { return doResetSync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doSyncEncryptAndDecrypt", function() { return doSyncEncryptAndDecrypt; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var lbryio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_2__);



function doSetDefaultAccount(success, failure) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SET_DEFAULT_ACCOUNT"]
    });
    lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].account_list().then(function (accountList) {
      var accounts = accountList.lbc_mainnet;
      var defaultId;

      for (var i = 0; i < accounts.length; ++i) {
        if (accounts[i].satoshis > 0) {
          defaultId = accounts[i].id;
          break;
        }
      } // In a case where there's no balance on either account
      // assume the second (which is created after sync) as default


      if (!defaultId && accounts.length > 1) {
        defaultId = accounts[1].id;
      } // Set the default account


      if (defaultId) {
        lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].account_set({
          account_id: defaultId,
          "default": true
        }).then(function () {
          if (success) {
            success();
          }
        })["catch"](function (err) {
          if (failure) {
            failure(err);
          }
        });
      } else if (failure) {
        // no default account to set
        failure('Could not set a default account'); // fail
      }
    })["catch"](function (err) {
      if (failure) {
        failure(err);
      }
    });
  };
}
function doSetSync(oldHash, newHash, data) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SET_SYNC_STARTED"]
    });
    return lbryio__WEBPACK_IMPORTED_MODULE_1__["default"].call('sync', 'set', {
      old_hash: oldHash,
      new_hash: newHash,
      data: data
    }, 'post').then(function (response) {
      if (!response.hash) {
        throw Error('No hash returned for sync/set.');
      }

      return dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SET_SYNC_COMPLETED"],
        data: {
          syncHash: response.hash
        }
      });
    })["catch"](function (error) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SET_SYNC_FAILED"],
        data: {
          error: error
        }
      });
    });
  };
}
function doGetSync(passedPassword, callback) {
  var password = passedPassword === null || passedPassword === undefined ? '' : passedPassword;

  function handleCallback(error, hasNewData) {
    if (callback) {
      if (typeof callback !== 'function') {
        throw new Error('Second argument passed to "doGetSync" must be a function');
      }

      callback(error, hasNewData);
    }
  }

  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_STARTED"]
    });
    var data = {};
    lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].wallet_status().then(function (status) {
      if (status.is_locked) {
        return lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].wallet_unlock({
          password: password
        });
      } // Wallet is already unlocked


      return true;
    }).then(function (isUnlocked) {
      if (isUnlocked) {
        return lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].sync_hash();
      }

      data.unlockFailed = true;
      throw new Error();
    }).then(function (hash) {
      return lbryio__WEBPACK_IMPORTED_MODULE_1__["default"].call('sync', 'get', {
        hash: hash
      }, 'post');
    }).then(function (response) {
      var syncHash = response.hash;
      data.syncHash = syncHash;
      data.syncData = response.data;
      data.changed = response.changed;
      data.hasSyncedWallet = true;

      if (response.changed) {
        return lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].sync_apply({
          password: password,
          data: response.data,
          blocking: true
        });
      }
    }).then(function (response) {
      if (!response) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_COMPLETED"],
          data: data
        });
        handleCallback(null, data.changed);
        return;
      }

      var walletHash = response.hash,
          walletData = response.data;

      if (walletHash !== data.syncHash) {
        // different local hash, need to synchronise
        dispatch(doSetSync(data.syncHash, walletHash, walletData));
      }

      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_COMPLETED"],
        data: data
      });
      handleCallback(null, data.changed);
    })["catch"](function (syncAttemptError) {
      if (data.unlockFailed) {
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_FAILED"],
          data: {
            error: syncAttemptError
          }
        });

        if (password !== '') {
          dispatch({
            type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_APPLY_BAD_PASSWORD"]
          });
        }

        handleCallback(syncAttemptError);
      } else if (data.hasSyncedWallet) {
        var error = 'Error getting synced wallet';
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_FAILED"],
          data: {
            error: error
          }
        }); // Temp solution until we have a bad password error code
        // Don't fail on blank passwords so we don't show a "password error" message
        // before users have ever entered a password

        if (password !== '') {
          dispatch({
            type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_APPLY_BAD_PASSWORD"]
          });
        }

        handleCallback(error);
      } else {
        // user doesn't have a synced wallet
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_COMPLETED"],
          data: {
            hasSyncedWallet: false,
            syncHash: null
          }
        }); // call sync_apply to get data to sync
        // first time sync. use any string for old hash

        lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].sync_apply({
          password: password
        }).then(function (_ref) {
          var walletHash = _ref.hash,
              syncApplyData = _ref.data;
          dispatch(doSetSync('', walletHash, syncApplyData, password));
          handleCallback();
        })["catch"](function (syncApplyError) {
          handleCallback(syncApplyError);
        });
      }
    });
  };
}
function doSyncApply(syncHash, syncData, password) {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_APPLY_STARTED"]
    });
    lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].sync_apply({
      password: password,
      data: syncData
    }).then(function (_ref2) {
      var walletHash = _ref2.hash,
          walletData = _ref2.data;
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_APPLY_COMPLETED"]
      });

      if (walletHash !== syncHash) {
        // different local hash, need to synchronise
        dispatch(doSetSync(syncHash, walletHash, walletData));
      }
    })["catch"](function () {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_APPLY_FAILED"],
        data: {
          error: 'Invalid password specified. Please enter the password for your previously synchronised wallet.'
        }
      });
    });
  };
}
function doCheckSync() {
  return function (dispatch) {
    dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_STARTED"]
    });
    lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].sync_hash().then(function (hash) {
      lbryio__WEBPACK_IMPORTED_MODULE_1__["default"].call('sync', 'get', {
        hash: hash
      }, 'post').then(function (response) {
        var data = {
          hasSyncedWallet: true,
          syncHash: response.hash,
          syncData: response.data,
          hashChanged: response.changed
        };
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_COMPLETED"],
          data: data
        });
      })["catch"](function () {
        // user doesn't have a synced wallet
        dispatch({
          type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_COMPLETED"],
          data: {
            hasSyncedWallet: false,
            syncHash: null
          }
        });
      });
    });
  };
}
function doResetSync() {
  return function (dispatch) {
    return new Promise(function (resolve) {
      dispatch({
        type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_RESET"]
      });
      resolve();
    });
  };
}
function doSyncEncryptAndDecrypt(oldPassword, newPassword, encrypt) {
  return function (dispatch) {
    var data = {};
    return lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].sync_hash().then(function (hash) {
      return lbryio__WEBPACK_IMPORTED_MODULE_1__["default"].call('sync', 'get', {
        hash: hash
      }, 'post');
    }).then(function (syncGetResponse) {
      data.oldHash = syncGetResponse.hash;
      return lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].sync_apply({
        password: oldPassword,
        data: syncGetResponse.data
      });
    }).then(function () {
      if (encrypt) {
        dispatch(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_2__["doWalletEncrypt"])(newPassword));
      } else {
        dispatch(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_2__["doWalletDecrypt"])());
      }
    }).then(function () {
      return lbry_redux__WEBPACK_IMPORTED_MODULE_2__["Lbry"].sync_apply({
        password: newPassword
      });
    }).then(function (syncApplyResponse) {
      if (syncApplyResponse.hash !== data.oldHash) {
        return dispatch(doSetSync(data.oldHash, syncApplyResponse.hash, syncApplyResponse.data));
      }
    })["catch"](console.error);
  };
}

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doUpdateUploadProgress", function() { return doUpdateUploadProgress; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

var doUpdateUploadProgress = function doUpdateUploadProgress(progress, params, xhr) {
  return function (dispatch) {
    return dispatch({
      type: constants_action_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_UPLOAD_PROGRESS"],
      data: {
        progress: progress,
        params: params,
        xhr: xhr
      }
    });
  };
};

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authReducer", function() { return authReducer; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

var reducers = {};
var defaultState = {
  authenticating: false
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GENERATE_AUTH_TOKEN_FAILURE"]] = function (state) {
  return Object.assign({}, state, {
    authToken: null,
    authenticating: false
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GENERATE_AUTH_TOKEN_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    authenticating: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GENERATE_AUTH_TOKEN_SUCCESS"]] = function (state, action) {
  return Object.assign({}, state, {
    authToken: action.data.authToken,
    authenticating: false
  });
};

function authReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rewardsReducer", function() { return rewardsReducer; });
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_0__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var reducers = {};
var defaultState = {
  fetching: false,
  claimedRewardsById: {},
  // id => reward
  unclaimedRewards: [],
  claimPendingByType: {},
  claimErrorsByType: {},
  rewardedContentClaimIds: []
};

reducers[lbry_redux__WEBPACK_IMPORTED_MODULE_0__["ACTIONS"].FETCH_REWARDS_STARTED] = function (state) {
  return Object.assign({}, state, {
    fetching: true
  });
};

reducers[lbry_redux__WEBPACK_IMPORTED_MODULE_0__["ACTIONS"].FETCH_REWARDS_COMPLETED] = function (state, action) {
  var userRewards = action.data.userRewards;
  var unclaimedRewards = [];
  var claimedRewards = {};
  userRewards.forEach(function (reward) {
    if (reward.transaction_id) {
      claimedRewards[reward.id] = reward;
    } else {
      unclaimedRewards.push(reward);
    }
  });
  return Object.assign({}, state, {
    claimedRewardsById: claimedRewards,
    unclaimedRewards: unclaimedRewards,
    fetching: false
  });
};

function setClaimRewardState(state, reward, isClaiming) {
  var errorMessage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var newClaimPendingByType = Object.assign({}, state.claimPendingByType);
  var newClaimErrorsByType = Object.assign({}, state.claimErrorsByType); // Currently, for multiple rewards of the same type, they will both show "claiming" when one is beacuse we track this by `reward_type`
  // To fix this we will need to use `claim_code` instead, and change all selectors to match

  if (reward) {
    if (isClaiming) {
      newClaimPendingByType[reward.reward_type] = isClaiming;
    } else {
      delete newClaimPendingByType[reward.reward_type];
    }

    if (errorMessage) {
      newClaimErrorsByType[reward.reward_type] = errorMessage;
    } else {
      delete newClaimErrorsByType[reward.reward_type];
    }
  }

  return Object.assign({}, state, {
    claimPendingByType: newClaimPendingByType,
    claimErrorsByType: newClaimErrorsByType
  });
}

reducers[lbry_redux__WEBPACK_IMPORTED_MODULE_0__["ACTIONS"].CLAIM_REWARD_STARTED] = function (state, action) {
  var reward = action.data.reward;
  return setClaimRewardState(state, reward, true, '');
};

reducers[lbry_redux__WEBPACK_IMPORTED_MODULE_0__["ACTIONS"].CLAIM_REWARD_SUCCESS] = function (state, action) {
  var reward = action.data.reward;
  var unclaimedRewards = state.unclaimedRewards;
  var index = unclaimedRewards.findIndex(function (ur) {
    return ur.claim_code === reward.claim_code;
  });
  unclaimedRewards.splice(index, 1);
  var claimedRewardsById = state.claimedRewardsById;
  claimedRewardsById[reward.id] = reward;

  var newState = _objectSpread({}, state, {
    unclaimedRewards: _toConsumableArray(unclaimedRewards),
    claimedRewardsById: _objectSpread({}, claimedRewardsById)
  });

  return setClaimRewardState(newState, reward, false, '');
};

reducers[lbry_redux__WEBPACK_IMPORTED_MODULE_0__["ACTIONS"].CLAIM_REWARD_FAILURE] = function (state, action) {
  var _action$data = action.data,
      reward = _action$data.reward,
      error = _action$data.error;
  return setClaimRewardState(state, reward, false, error ? error.message : '');
};

reducers[lbry_redux__WEBPACK_IMPORTED_MODULE_0__["ACTIONS"].CLAIM_REWARD_CLEAR_ERROR] = function (state, action) {
  var reward = action.data.reward;
  return setClaimRewardState(state, reward, state.claimPendingByType[reward.reward_type], '');
};

reducers[lbry_redux__WEBPACK_IMPORTED_MODULE_0__["ACTIONS"].FETCH_REWARD_CONTENT_COMPLETED] = function (state, action) {
  var claimIds = action.data.claimIds;
  return Object.assign({}, state, {
    rewardedContentClaimIds: claimIds
  });
};

function rewardsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userReducer", function() { return userReducer; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var reducers = {};
var defaultState = {
  authenticationIsPending: false,
  userIsPending: false,
  emailNewIsPending: false,
  emailNewErrorMessage: '',
  emailToVerify: '',
  emailAlreadyExists: false,
  emailDoesNotExist: false,
  resendingVerificationEmail: false,
  passwordResetPending: false,
  passwordResetSuccess: false,
  passwordResetError: undefined,
  passwordSetPending: false,
  passwordSetSuccess: false,
  passwordSetError: undefined,
  inviteNewErrorMessage: '',
  inviteNewIsPending: false,
  inviteStatusIsPending: false,
  invitesRemaining: undefined,
  invitees: undefined,
  referralLink: undefined,
  referralCode: undefined,
  user: undefined,
  accessToken: undefined,
  youtubeChannelImportPending: false,
  youtubeChannelImportErrorMessage: '',
  referrerSetIsPending: false,
  referrerSetError: ''
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["AUTHENTICATION_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    authenticationIsPending: true,
    userIsPending: true,
    accessToken: defaultState.accessToken
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["AUTHENTICATION_SUCCESS"]] = function (state, action) {
  return Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    accessToken: action.data.accessToken,
    user: action.data.user
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["AUTHENTICATION_FAILURE"]] = function (state) {
  return Object.assign({}, state, {
    authenticationIsPending: false,
    userIsPending: false,
    user: null
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_FETCH_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    userIsPending: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_FETCH_SUCCESS"]] = function (state, action) {
  return Object.assign({}, state, {
    userIsPending: false,
    user: action.data.user,
    emailToVerify: action.data.user.has_verified_email ? null : state.emailToVerify
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_FETCH_FAILURE"]] = function (state) {
  return Object.assign({}, state, {
    userIsPending: true,
    user: null
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PHONE_NEW_STARTED"]] = function (state, action) {
  var user = Object.assign({}, state.user);
  user.country_code = action.data.country_code;
  return Object.assign({}, state, {
    phoneNewIsPending: true,
    phoneNewErrorMessage: '',
    user: user
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PHONE_NEW_SUCCESS"]] = function (state, action) {
  return Object.assign({}, state, {
    phoneToVerify: action.data.phone,
    phoneNewIsPending: false
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PHONE_RESET"]] = function (state) {
  return Object.assign({}, state, {
    phoneToVerify: null
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PHONE_NEW_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    phoneNewIsPending: false,
    phoneNewErrorMessage: action.data.error
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PHONE_VERIFY_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    phoneVerifyIsPending: true,
    phoneVerifyErrorMessage: ''
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PHONE_VERIFY_SUCCESS"]] = function (state, action) {
  return Object.assign({}, state, {
    phoneToVerify: '',
    phoneVerifyIsPending: false,
    user: action.data.user
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PHONE_VERIFY_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    phoneVerifyIsPending: false,
    phoneVerifyErrorMessage: action.data.error
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_NEW_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    emailNewIsPending: true,
    emailNewErrorMessage: '',
    emailAlreadyExists: false,
    emailDoesNotExist: false
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_NEW_SUCCESS"]] = function (state, action) {
  var user = Object.assign({}, state.user);
  user.primary_email = action.data.email;
  return Object.assign({}, state, {
    emailToVerify: action.data.email,
    emailNewIsPending: false,
    user: user
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_NEW_EXISTS"]] = function (state) {
  return Object.assign({}, state, {
    emailAlreadyExists: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_NEW_DOES_NOT_EXIST"]] = function (state) {
  return Object.assign({}, state, {
    emailDoesNotExist: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_NEW_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    emailNewIsPending: false,
    emailNewErrorMessage: action.data.error
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_NEW_CLEAR_ENTRY"]] = function (state) {
  var newUser = _objectSpread({}, state.user);

  delete newUser.primary_email;
  return Object.assign({}, state, {
    emailNewErrorMessage: null,
    emailAlreadyExists: false,
    emailDoesNotExist: false,
    passwordExistsForUser: false,
    emailToVerify: null,
    user: newUser
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PASSWORD_SET_CLEAR"]] = function (state) {
  return Object.assign({}, state, {
    passwordResetSuccess: false,
    passwordResetPending: false,
    passwordResetError: null
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_VERIFY_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    emailVerifyIsPending: true,
    emailVerifyErrorMessage: ''
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_VERIFY_SUCCESS"]] = function (state, action) {
  var user = Object.assign({}, state.user);
  user.primary_email = action.data.email;
  return Object.assign({}, state, {
    emailToVerify: '',
    emailVerifyIsPending: false,
    user: user
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_VERIFY_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    emailVerifyIsPending: false,
    emailVerifyErrorMessage: action.data.error
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_VERIFY_SET"]] = function (state, action) {
  return Object.assign({}, state, {
    emailToVerify: action.data.email
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_IDENTITY_VERIFY_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    identityVerifyIsPending: true,
    identityVerifyErrorMessage: ''
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_IDENTITY_VERIFY_SUCCESS"]] = function (state, action) {
  return Object.assign({}, state, {
    identityVerifyIsPending: false,
    identityVerifyErrorMessage: '',
    user: action.data.user
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_IDENTITY_VERIFY_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    identityVerifyIsPending: false,
    identityVerifyErrorMessage: action.data.error
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_ACCESS_TOKEN_SUCCESS"]] = function (state, action) {
  var token = action.data.token;
  return Object.assign({}, state, {
    accessToken: token
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_INVITE_STATUS_FETCH_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    inviteStatusIsPending: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_INVITE_STATUS_FETCH_SUCCESS"]] = function (state, action) {
  return Object.assign({}, state, {
    inviteStatusIsPending: false,
    invitesRemaining: action.data.invitesRemaining,
    invitees: action.data.invitees,
    referralLink: action.data.referralLink,
    referralCode: action.data.referralCode
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_INVITE_NEW_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    inviteNewIsPending: true,
    inviteNewErrorMessage: ''
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_INVITE_NEW_SUCCESS"]] = function (state) {
  return Object.assign({}, state, {
    inviteNewIsPending: false,
    inviteNewErrorMessage: ''
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_INVITE_NEW_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    inviteNewIsPending: false,
    inviteNewErrorMessage: action.data.error.message
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_INVITE_STATUS_FETCH_FAILURE"]] = function (state) {
  return Object.assign({}, state, {
    inviteStatusIsPending: false,
    invitesRemaining: null,
    invitees: null
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_YOUTUBE_IMPORT_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    youtubeChannelImportPending: true,
    youtubeChannelImportErrorMessage: ''
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_YOUTUBE_IMPORT_SUCCESS"]] = function (state, action) {
  var total = action.data.reduce(function (acc, value) {
    return acc + value.total_published_videos;
  }, 0);
  var complete = action.data.reduce(function (acc, value) {
    return acc + value.total_transferred;
  }, 0);
  return Object.assign({}, state, {
    youtubeChannelImportPending: false,
    youtubeChannelImportErrorMessage: '',
    youtubeChannelImportTotal: total,
    youtubeChannelImportComplete: complete
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_YOUTUBE_IMPORT_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    youtubeChannelImportPending: false,
    youtubeChannelImportErrorMessage: action.data
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_VERIFY_RETRY_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    resendingVerificationEmail: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_VERIFY_RETRY_SUCCESS"]] = function (state) {
  return Object.assign({}, state, {
    resendingVerificationEmail: false
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_EMAIL_VERIFY_RETRY_FAILURE"]] = function (state) {
  return Object.assign({}, state, {
    resendingVerificationEmail: false
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_SET_REFERRER_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    referrerSetIsPending: true,
    referrerSetError: defaultState.referrerSetError
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_SET_REFERRER_SUCCESS"]] = function (state) {
  return Object.assign({}, state, {
    referrerSetIsPending: false,
    referrerSetError: defaultState.referrerSetError
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_SET_REFERRER_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    referrerSetIsPending: false,
    referrerSetError: action.data.error.message
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_SET_REFERRER_RESET"]] = function (state) {
  return Object.assign({}, state, {
    referrerSetIsPending: false,
    referrerSetError: defaultState.referrerSetError
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PASSWORD_EXISTS"]] = function (state) {
  return Object.assign({}, state, {
    passwordExistsForUser: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PASSWORD_RESET_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    passwordResetPending: true,
    passwordResetSuccess: defaultState.passwordResetSuccess,
    passwordResetError: null
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PASSWORD_RESET_SUCCESS"]] = function (state) {
  return Object.assign({}, state, {
    passwordResetPending: false,
    passwordResetSuccess: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PASSWORD_RESET_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    passwordResetPending: false,
    passwordResetError: action.data.error
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PASSWORD_SET_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    passwordSetPending: true,
    passwordSetSuccess: defaultState.passwordSetSuccess
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PASSWORD_SET_SUCCESS"]] = function (state) {
  return Object.assign({}, state, {
    passwordSetPending: false,
    passwordSetSuccess: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["USER_PASSWORD_SET_FAILURE"]] = function (state, action) {
  return Object.assign({}, state, {
    passwordSetPending: false,
    passwordSetError: action.data.error
  });
};

function userReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "costInfoReducer", function() { return costInfoReducer; });
/* harmony import */ var util_redux_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
var _handleActions;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var defaultState = {
  fetching: {},
  byUri: {}
};
var costInfoReducer = Object(util_redux_utils__WEBPACK_IMPORTED_MODULE_0__["handleActions"])((_handleActions = {}, _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_COST_INFO_STARTED"], function (state, action) {
  var uri = action.data.uri;
  var newFetching = Object.assign({}, state.fetching);
  newFetching[uri] = true;
  return _objectSpread({}, state, {
    fetching: newFetching
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_COST_INFO_COMPLETED"], function (state, action) {
  var _action$data = action.data,
      uri = _action$data.uri,
      costInfo = _action$data.costInfo;
  var newByUri = Object.assign({}, state.byUri);
  var newFetching = Object.assign({}, state.fetching);
  newByUri[uri] = costInfo;
  delete newFetching[uri];
  return _objectSpread({}, state, {
    byUri: newByUri,
    fetching: newFetching
  });
}), _handleActions), defaultState);

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blacklistReducer", function() { return blacklistReducer; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var util_redux_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
var _handleActions;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var defaultState = {
  fetchingBlackListedOutpoints: false,
  fetchingBlackListedOutpointsSucceed: undefined,
  blackListedOutpoints: undefined
};
var blacklistReducer = Object(util_redux_utils__WEBPACK_IMPORTED_MODULE_1__["handleActions"])((_handleActions = {}, _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_BLACK_LISTED_CONTENT_STARTED"], function (state) {
  return _objectSpread({}, state, {
    fetchingBlackListedOutpoints: true
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_BLACK_LISTED_CONTENT_COMPLETED"], function (state, action) {
  var _action$data = action.data,
      outpoints = _action$data.outpoints,
      success = _action$data.success;
  return _objectSpread({}, state, {
    fetchingBlackListedOutpoints: false,
    fetchingBlackListedOutpointsSucceed: success,
    blackListedOutpoints: outpoints
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_BLACK_LISTED_CONTENT_FAILED"], function (state, action) {
  var _action$data2 = action.data,
      error = _action$data2.error,
      success = _action$data2.success;
  return _objectSpread({}, state, {
    fetchingBlackListedOutpoints: false,
    fetchingBlackListedOutpointsSucceed: success,
    fetchingBlackListedOutpointsError: error
  });
}), _handleActions), defaultState);

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filteredReducer", function() { return filteredReducer; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var util_redux_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
var _handleActions;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var defaultState = {
  loading: false,
  filteredOutpoints: undefined
};
var filteredReducer = Object(util_redux_utils__WEBPACK_IMPORTED_MODULE_1__["handleActions"])((_handleActions = {}, _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_FILTERED_CONTENT_STARTED"], function (state) {
  return _objectSpread({}, state, {
    loading: true
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_FILTERED_CONTENT_COMPLETED"], function (state, action) {
  var outpoints = action.data.outpoints;
  return _objectSpread({}, state, {
    loading: false,
    filteredOutpoints: outpoints
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_0__["FETCH_FILTERED_CONTENT_FAILED"], function (state, action) {
  var error = action.data.error;
  return _objectSpread({}, state, {
    loading: false,
    fetchingFilteredOutpointsError: error
  });
}), _handleActions), defaultState);

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "homepageReducer", function() { return homepageReducer; });
/* harmony import */ var util_redux_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
var _handleActions;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var defaultState = {
  fetchingFeaturedContent: false,
  fetchingFeaturedContentFailed: false,
  featuredUris: undefined,
  fetchingTrendingContent: false,
  fetchingTrendingContentFailed: false,
  trendingUris: undefined
};
var homepageReducer = Object(util_redux_utils__WEBPACK_IMPORTED_MODULE_0__["handleActions"])((_handleActions = {}, _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_FEATURED_CONTENT_STARTED"], function (state) {
  return _objectSpread({}, state, {
    fetchingFeaturedContent: true
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_FEATURED_CONTENT_COMPLETED"], function (state, action) {
  var _action$data = action.data,
      uris = _action$data.uris,
      success = _action$data.success;
  return _objectSpread({}, state, {
    fetchingFeaturedContent: false,
    fetchingFeaturedContentFailed: !success,
    featuredUris: uris
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_TRENDING_CONTENT_STARTED"], function (state) {
  return _objectSpread({}, state, {
    fetchingTrendingContent: true
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_TRENDING_CONTENT_COMPLETED"], function (state, action) {
  var _action$data2 = action.data,
      uris = _action$data2.uris,
      success = _action$data2.success;
  return _objectSpread({}, state, {
    fetchingTrendingContent: false,
    fetchingTrendingContentFailed: !success,
    trendingUris: uris
  });
}), _handleActions), defaultState);

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "statsReducer", function() { return statsReducer; });
/* harmony import */ var util_redux_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
var _handleActions;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var defaultState = {
  fetchingViewCount: false,
  viewCountError: undefined,
  viewCountById: {},
  fetchingSubCount: false,
  subCountError: undefined,
  subCountById: {}
};
var statsReducer = Object(util_redux_utils__WEBPACK_IMPORTED_MODULE_0__["handleActions"])((_handleActions = {}, _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_VIEW_COUNT_STARTED"], function (state) {
  return _objectSpread({}, state, {
    fetchingViewCount: true
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_VIEW_COUNT_FAILED"], function (state, action) {
  return _objectSpread({}, state, {
    viewCountError: action.data
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_VIEW_COUNT_COMPLETED"], function (state, action) {
  var _action$data = action.data,
      claimId = _action$data.claimId,
      viewCount = _action$data.viewCount;

  var viewCountById = _objectSpread({}, state.viewCountById, _defineProperty({}, claimId, viewCount));

  return _objectSpread({}, state, {
    fetchingViewCount: false,
    viewCountById: viewCountById
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_SUB_COUNT_STARTED"], function (state) {
  return _objectSpread({}, state, {
    fetchingSubCount: true
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_SUB_COUNT_FAILED"], function (state, action) {
  return _objectSpread({}, state, {
    subCountError: action.data
  });
}), _defineProperty(_handleActions, constants_action_types__WEBPACK_IMPORTED_MODULE_1__["FETCH_SUB_COUNT_COMPLETED"], function (state, action) {
  var _action$data2 = action.data,
      claimId = _action$data2.claimId,
      subCount = _action$data2.subCount;

  var subCountById = _objectSpread({}, state.subCountById, _defineProperty({}, claimId, subCount));

  return _objectSpread({}, state, {
    fetchingSubCount: false,
    subCountById: subCountById
  });
}), _handleActions), defaultState);

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "syncReducer", function() { return syncReducer; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

var reducers = {};
var defaultState = {
  hasSyncedWallet: false,
  syncHash: null,
  syncData: null,
  setSyncErrorMessage: null,
  getSyncErrorMessage: null,
  syncApplyErrorMessage: '',
  syncApplyIsPending: false,
  syncApplyPasswordError: false,
  getSyncIsPending: false,
  setSyncIsPending: false,
  hashChanged: false
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    getSyncIsPending: true,
    getSyncErrorMessage: null
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_COMPLETED"]] = function (state, action) {
  return Object.assign({}, state, {
    syncHash: action.data.syncHash,
    syncData: action.data.syncData,
    hasSyncedWallet: action.data.hasSyncedWallet,
    getSyncIsPending: false,
    hashChanged: action.data.hashChanged
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["GET_SYNC_FAILED"]] = function (state, action) {
  return Object.assign({}, state, {
    getSyncIsPending: false,
    getSyncErrorMessage: action.data.error
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SET_SYNC_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    setSyncIsPending: true,
    setSyncErrorMessage: null
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SET_SYNC_FAILED"]] = function (state, action) {
  return Object.assign({}, state, {
    setSyncIsPending: false,
    setSyncErrorMessage: action.data.error
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SET_SYNC_COMPLETED"]] = function (state, action) {
  return Object.assign({}, state, {
    setSyncIsPending: false,
    setSyncErrorMessage: null,
    hasSyncedWallet: true,
    // sync was successful, so the user has a synced wallet at this point
    syncHash: action.data.syncHash
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_APPLY_STARTED"]] = function (state) {
  return Object.assign({}, state, {
    syncApplyPasswordError: false,
    syncApplyIsPending: true,
    syncApplyErrorMessage: ''
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_APPLY_COMPLETED"]] = function (state) {
  return Object.assign({}, state, {
    syncApplyIsPending: false,
    syncApplyErrorMessage: ''
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_APPLY_FAILED"]] = function (state, action) {
  return Object.assign({}, state, {
    syncApplyIsPending: false,
    syncApplyErrorMessage: action.data.error
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_APPLY_BAD_PASSWORD"]] = function (state) {
  return Object.assign({}, state, {
    syncApplyPasswordError: true
  });
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["SYNC_RESET"]] = function () {
  return defaultState;
};

function syncReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lbrytvReducer", function() { return lbrytvReducer; });
/* harmony import */ var constants_action_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


/*
test mock:
  currentUploads: {
    'test#upload': {
      progress: 50,
      params: {
        name: 'steve',
        thumbnail_url: 'https://dev2.spee.ch/4/KMNtoSZ009fawGz59VG8PrID.jpeg',
      },
    },
  },
 */

var reducers = {};
var defaultState = {
  currentUploads: {}
};

reducers[constants_action_types__WEBPACK_IMPORTED_MODULE_0__["UPDATE_UPLOAD_PROGRESS"]] = function (state, action) {
  var _action$data = action.data,
      progress = _action$data.progress,
      params = _action$data.params,
      xhr = _action$data.xhr;
  var key = params.channel ? "".concat(params.name, "#").concat(params.channel) : "".concat(params.name, "#anonymous");
  var currentUploads;

  if (!progress) {
    currentUploads = Object.assign({}, state.currentUploads);
    Object.keys(currentUploads).forEach(function (k) {
      if (k === key) {
        delete currentUploads[key];
      }
    });
  } else {
    currentUploads = Object.assign({}, state.currentUploads);
    currentUploads[key] = {
      progress: progress,
      params: params,
      xhr: xhr
    };
  }

  return _objectSpread({}, state, {
    currentUploads: currentUploads
  });
};

function lbrytvReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectAuthToken", function() { return selectAuthToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectIsAuthenticating", function() { return selectIsAuthenticating; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);


var selectState = function selectState(state) {
  return state.auth || {};
};

var selectAuthToken = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.authToken;
});
var selectIsAuthenticating = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.authenticating;
});

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectState", function() { return selectState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectAllCostInfoByUri", function() { return selectAllCostInfoByUri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectCostInfoForUri", function() { return makeSelectCostInfoForUri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectFetchingCostInfo", function() { return selectFetchingCostInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectFetchingCostInfoForUri", function() { return makeSelectFetchingCostInfoForUri; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);

var selectState = function selectState(state) {
  return state.costInfo || {};
};
var selectAllCostInfoByUri = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.byUri || {};
});
var makeSelectCostInfoForUri = function makeSelectCostInfoForUri(uri) {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectAllCostInfoByUri, function (costInfos) {
    return costInfos && costInfos[uri];
  });
};
var selectFetchingCostInfo = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.fetching || {};
});
var makeSelectFetchingCostInfoForUri = function makeSelectFetchingCostInfoForUri(uri) {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectFetchingCostInfo, function (fetchingByUri) {
    return fetchingByUri && fetchingByUri[uri];
  });
};

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectState", function() { return selectState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectBlackListedOutpoints", function() { return selectBlackListedOutpoints; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);

var selectState = function selectState(state) {
  return state.blacklist || {};
};
var selectBlackListedOutpoints = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.blackListedOutpoints;
});

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectState", function() { return selectState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectFilteredOutpoints", function() { return selectFilteredOutpoints; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);

var selectState = function selectState(state) {
  return state.filtered || {};
};
var selectFilteredOutpoints = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.filteredOutpoints;
});

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectFeaturedUris", function() { return selectFeaturedUris; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectFetchingFeaturedUris", function() { return selectFetchingFeaturedUris; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectTrendingUris", function() { return selectTrendingUris; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectFetchingTrendingUris", function() { return selectFetchingTrendingUris; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);


var selectState = function selectState(state) {
  return state.homepage || {};
};

var selectFeaturedUris = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.featuredUris;
});
var selectFetchingFeaturedUris = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.fetchingFeaturedContent;
});
var selectTrendingUris = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.trendingUris;
});
var selectFetchingTrendingUris = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.fetchingTrendingContent;
});

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectViewCount", function() { return selectViewCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSubCount", function() { return selectSubCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectViewCountForUri", function() { return makeSelectViewCountForUri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeSelectSubCountForUri", function() { return makeSelectSubCountForUri; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var lbry_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lbry_redux__WEBPACK_IMPORTED_MODULE_1__);



var selectState = function selectState(state) {
  return state.stats || {};
};

var selectViewCount = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.viewCountById;
});
var selectSubCount = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.subCountById;
});
var makeSelectViewCountForUri = function makeSelectViewCountForUri(uri) {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_1__["makeSelectClaimForUri"])(uri), selectViewCount, function (claim, viewCountById) {
    return claim ? viewCountById[claim.claim_id] || 0 : 0;
  });
};
var makeSelectSubCountForUri = function makeSelectSubCountForUri(uri) {
  return Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(Object(lbry_redux__WEBPACK_IMPORTED_MODULE_1__["makeSelectClaimForUri"])(uri), selectSubCount, function (claim, subCountById) {
    return claim ? subCountById[claim.claim_id] || 0 : 0;
  });
};

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectHasSyncedWallet", function() { return selectHasSyncedWallet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSyncHash", function() { return selectSyncHash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSyncData", function() { return selectSyncData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSetSyncErrorMessage", function() { return selectSetSyncErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectGetSyncErrorMessage", function() { return selectGetSyncErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectGetSyncIsPending", function() { return selectGetSyncIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSetSyncIsPending", function() { return selectSetSyncIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectHashChanged", function() { return selectHashChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSyncApplyIsPending", function() { return selectSyncApplyIsPending; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSyncApplyErrorMessage", function() { return selectSyncApplyErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectSyncApplyPasswordError", function() { return selectSyncApplyPasswordError; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);


var selectState = function selectState(state) {
  return state.sync || {};
};

var selectHasSyncedWallet = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.hasSyncedWallet;
});
var selectSyncHash = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.syncHash;
});
var selectSyncData = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.syncData;
});
var selectSetSyncErrorMessage = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.setSyncErrorMessage;
});
var selectGetSyncErrorMessage = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.getSyncErrorMessage;
});
var selectGetSyncIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.getSyncIsPending;
});
var selectSetSyncIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.setSyncIsPending;
});
var selectHashChanged = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.hashChanged;
});
var selectSyncApplyIsPending = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.syncApplyIsPending;
});
var selectSyncApplyErrorMessage = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.syncApplyErrorMessage;
});
var selectSyncApplyPasswordError = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.syncApplyPasswordError;
});

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectCurrentUploads", function() { return selectCurrentUploads; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectUploadCount", function() { return selectUploadCount; });
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_0__);


var selectState = function selectState(state) {
  return state.lbrytv || {};
};

var selectCurrentUploads = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, function (state) {
  return state.currentUploads;
});
var selectUploadCount = Object(reselect__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectCurrentUploads, function (currentUploads) {
  return currentUploads && Object.keys(currentUploads).length;
});

/***/ })
/******/ ]);
});