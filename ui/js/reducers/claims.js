import * as types from 'constants/action_types';
import lbryuri from 'lbryuri';

const reducers = {};
const defaultState = {};

reducers[types.RESOLVE_URI_COMPLETED] = function(state, action) {
	const { uri, certificate, claim } = action.data;

	const newClaims = Object.assign({}, state.claimsByUri);

	newClaims[uri] = claim;

	//This needs a sanity boost...
	if (certificate !== undefined && claim === undefined) {
		const uriParts = lbryuri.parse(uri);
		// newChannelClaims[uri] = certificate
		if (claim === undefined) {
			newClaims[uri] = certificate;
		}
	}

	return Object.assign({}, state, {
		claimsByUri: newClaims
	});
};

reducers[types.RESOLVE_URI_CANCELED] = function(state, action) {
	const uri = action.data.uri;
	const newClaims = Object.assign({}, state.claimsByUri);
	delete newClaims[uri];
	return Object.assign({}, state, {
		claimsByUri: newClaims
	});
};

reducers[types.FETCH_CLAIM_LIST_MINE_STARTED] = function(state, action) {
	return Object.assign({}, state, {
		isClaimListMinePending: true
	});
};

reducers[types.FETCH_CLAIM_LIST_MINE_COMPLETED] = function(state, action) {
	const { claims } = action.data;
	const myClaims = new Set(state.myClaims);
	const byUri = Object.assign({}, state.claimsByUri);

	claims.forEach(claim => {
		const uri = lbryuri.build({
			contentName: claim.name,
			claimId: claim.claim_id,
			claimSequence: claim.nout
		});
		myClaims.add(uri);
		byUri[uri] = claim;
	});

	return Object.assign({}, state, {
		isClaimListMinePending: false,
		myClaims: myClaims,
		claimsByUri: byUri
	});
};

// reducers[types.FETCH_CHANNEL_CLAIMS_STARTED] = function(state, action) {
//   const {
//     uri,
//   } = action.data
//
//   const newClaims = Object.assign({}, state.claimsByChannel)
//
//   if (claims !== undefined) {
//     newClaims[uri] = claims
//   }
//
//   return Object.assign({}, state, {
//     claimsByChannel: newClaims
//   })
// }

reducers[types.FETCH_CHANNEL_CLAIMS_COMPLETED] = function(state, action) {
	const { uri, claims } = action.data;

	const newClaims = Object.assign({}, state.claimsByChannel);

	if (claims !== undefined) {
		newClaims[uri] = claims;
	}

	return Object.assign({}, state, {
		claimsByChannel: newClaims
	});
};

export default function reducer(state = defaultState, action) {
	const handler = reducers[action.type];
	if (handler) return handler(state, action);
	return state;
}
