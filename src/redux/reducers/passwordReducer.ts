import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PasswordState {
  masterPassword: string | null;
  passwords: { keyword: string; password: string }[];
}

const initialState: PasswordState = {
  masterPassword: null,
  passwords: [],
};

const passwordSlice = createSlice({
  name: "passwords",
  initialState,
  reducers: {
    setMasterPassword: (state, action: PayloadAction<string>) => {
      state.masterPassword = action.payload;
    },
    addPassword: (
      state,
      action: PayloadAction<{ keyword: string; password: string }>
    ) => {
      state.passwords.push(action.payload);
    },
  },
});

export const { setMasterPassword, addPassword } = passwordSlice.actions;
export default passwordSlice.reducer;
