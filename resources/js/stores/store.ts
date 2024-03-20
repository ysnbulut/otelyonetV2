import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit'
import darkModeReducer from './darkModeSlice'
import colorSchemeReducer from './colorSchemeSlice'
import hotelSideMenuReducer from './hotelSideMenuSlice'
import adminSideMenuReducer from './adminSideMenuSlice'
export const store = configureStore({
	reducer: {
		darkMode: darkModeReducer,
		colorScheme: colorSchemeReducer,
		hotelSideMenu: hotelSideMenuReducer,
		adminSideMenu: adminSideMenuReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
