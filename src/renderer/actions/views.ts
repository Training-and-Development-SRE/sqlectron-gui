import { getDatabaseByQueryID } from './connections';
import { sqlectron } from '../api';

export const FETCH_VIEWS_REQUEST = 'FETCH_VIEWS_REQUEST';
export const FETCH_VIEWS_SUCCESS = 'FETCH_VIEWS_SUCCESS';
export const FETCH_VIEWS_FAILURE = 'FETCH_VIEWS_FAILURE';

export function fetchViewsIfNeeded(database, filter) {
  return (dispatch, getState) => {
    if (shouldFetchViews(getState(), database)) {
      dispatch(fetchViews(database, filter));
    }
  };
}

function shouldFetchViews(state, database) {
  const views = state.views;
  if (!views) return true;
  if (views.isFetching) return false;
  if (!views.viewsByDatabase[database]) return true;
  return views.didInvalidate;
}

function fetchViews(database, filter) {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_VIEWS_REQUEST, database });
    try {
      const db = getDatabaseByQueryID(getState());
      const views = await sqlectron.listViews(db, filter);
      dispatch({ type: FETCH_VIEWS_SUCCESS, database, views });
    } catch (error) {
      dispatch({ type: FETCH_VIEWS_FAILURE, error });
    }
  };
}