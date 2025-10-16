import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInistance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch logo
export const fetchLogo = createAsyncThunk("fetchLogo", async () => {
  try {
    const response = await axiosInistance.get("/tracking/systemsetting/");
    return response.data.logo_image;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null; // Return null to prevent crashes
  }
});



//add logo
export const addLogo = createAsyncThunk("addLogo", async () => {
  try {
    const response = await axiosInistance.post("/tracking/systemsetting/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    isLoading: false,
    logo: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      //fetch  logo
      .addCase(fetchLogo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchLogo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logo = action.payload;
      })
      .addCase(fetchLogo.rejected, (state, action) => {
        state.error = true;
      })

      //add logo
      .addCase(addLogo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addLogo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logo.push(action.payload);
      })
      .addCase(addLogo.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default settingSlice.reducer;
