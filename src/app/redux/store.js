// import { configureStore } from '@reduxjs/toolkit';
// import { reducer } from './slice';


// const store = configureStore({
//     reducer
// });

// export default store;


import { configureStore } from '@reduxjs/toolkit';
import { ipdReducer, opdReducer } from './slice'; // Adjust the import according to your actual file and export

const store = configureStore({
    reducer: {
        ipd: ipdReducer,
        opd: opdReducer// Key should match the slice name defined in your slice
    }
});

export default store;