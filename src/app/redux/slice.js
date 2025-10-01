// import { createSlice } from '@reduxjs/toolkit';

// const initialStateIPD = {
//     ipd: []
// };
// const initialStateOPD = {
//     opd: []
// };

// const Slice = createSlice({
//     name: "addIPDno",
//     initialState: initialStateIPD,
//     reducers: {
//         addIPDno: (state, action) => {
//             const data = {
//                 name: action.payload
//             };
//             state.json.push(data);
//         }
//     },
//     name: "addOPDno",
//     initialState: initialStateOPD,
//     reducers: {
//         addOPDno: (state, action) => {
//             const data = {
//                 name: action.payload
//             }
//             state.json.push(data);
//         }
//     }
// });

// export const { addIPDno, addOPDno } = Slice.actions;

// export default Slice.reducer;


import { createSlice } from '@reduxjs/toolkit';

// Slice for IPD
const ipdSlice = createSlice({
    name: 'ipd',
    initialState: {
        ipd: []
    },
    reducers: {
        addIPDno: (state, action) => {
            const data = {
                name: action.payload
            };
            state.ipd.push(data);
        }
    }
});

// Slice for OPD
const opdSlice = createSlice({
    name: 'opd',
    initialState: {
        opd: []
    },
    reducers: {
        addOPDno: (state, action) => {
            const data = {
                name: action.payload
            };
            state.opd.push(data);
        }
    }
});

export const { addIPDno } = ipdSlice.actions;
export const { addOPDno } = opdSlice.actions;

export const ipdReducer = ipdSlice.reducer;
export const opdReducer = opdSlice.reducer;