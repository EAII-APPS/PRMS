import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../GlobalContexts/Base_url";

let token = "";
setInterval(() => {
  token = localStorage.getItem("access");
}, 0.01);

//fetch User Data
export const fetchUserData = createAsyncThunk("fetchUserData", async () => {
  try {
    const userData = await axiosInstance.get("/userApp/users/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return userData.data;
  } catch (error) {}
});

//delete Selected User
export const deleteSelectedUser = createAsyncThunk(
  "deleteSelectedUser",
  async (selectedId) => {
    try {
      await axiosInstance.delete(`/userApp/users/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return selectedId;
    } catch (error) {}
  }
);

//change Status Of Selected User
export const changeStatusOfSelectedUser = createAsyncThunk(
  "changeStatusOfSelectedUser",
  async ({ changeStatusId, currentItem }) => {
    try {
      await axiosInstance.put(
        `/userApp/users/${changeStatusId}/`,
        {
          status: !currentItem,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { id: changeStatusId, status: currentItem };
    } catch (error) {}
  }
);

//edit User
export const editSelectedUser = createAsyncThunk(
  "EditSelectedUser",
  async ({
    emailEdit,
    firstNameEdit,
    lastNameEdit,
    phoneEdit,
    genderEdit,
    roleEdit,
    monitoringIdEdit,
    sectorIdEdit,
    divisionIdEdit,
    editUserId,
  }) => {
    try {
      const editUser = await axiosInstance.put(
        `/userApp/users/${editUserId}/`,
        {
          email: emailEdit,
          first_name: firstNameEdit,
          last_name: lastNameEdit,
          phone: phoneEdit,
          gender: genderEdit,
          role: roleEdit,
          monitoring_id: monitoringIdEdit,
          sector_id: sectorIdEdit,
          division_id: divisionIdEdit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        emailEdit,
        firstNameEdit,
        lastNameEdit,
        phoneEdit,
        genderEdit,
        roleEdit,
        monitoringIdEdit,
        sectorIdEdit,
        divisionIdEdit,
        editUserId,
      };
    } catch (error) {}
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    userData: null,
    error: false,
  },
  extraReducers: (builder) => {
    builder
      //fetchUserData
      .addCase(fetchUserData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = true;
      })

      //deleteSelectedUser
      .addCase(deleteSelectedUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteSelectedUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = state.userData.filter(
          (user) => user.id !== action.payload
        );
      })
      .addCase(deleteSelectedUser.rejected, (state, action) => {
        state.error = true;
      })

      //edit
      .addCase(editSelectedUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editSelectedUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const {
          emailEdit,
          firstNameEdit,
          lastNameEdit,
          phoneEdit,
          genderEdit,
          roleEdit,
          monitoringIdEdit,
          sectorIdEdit,
          divisionIdEdit,
          editUserId,
        } = action.payload;
        const targetDivisionId = state.userData.findIndex(
          (userData) => userData.id === editUserId
        );
        if (targetDivisionId !== -1) {
          state.userData[targetDivisionId].email = emailEdit;
          state.userData[targetDivisionId].first_name = firstNameEdit;
          state.userData[targetDivisionId].last_name = lastNameEdit;
          state.userData[targetDivisionId].phone = phoneEdit;
          state.userData[targetDivisionId].gender = genderEdit;
          state.userData[targetDivisionId].role_name = roleEdit;
          state.userData[targetDivisionId].monitoring_id = monitoringIdEdit;
          state.userData[targetDivisionId].sector_id = sectorIdEdit;
          state.userData[targetDivisionId].division_id = divisionIdEdit;
        }
      })
      .addCase(editSelectedUser.rejected, (state, action) => {
        state.error = true;
      })

      //changeStatusOfSelectedUser
      .addCase(changeStatusOfSelectedUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(changeStatusOfSelectedUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, status } = action.payload;
        const targetUserIndex = state.userData.findIndex(
          (user) => user.id === id
        );
        if (targetUserIndex !== -1) {
          state.userData[targetUserIndex].status = !status;
        }
      })
      .addCase(changeStatusOfSelectedUser.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export default userSlice.reducer;
