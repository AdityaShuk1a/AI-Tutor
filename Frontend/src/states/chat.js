import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (text, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      const url = `http://localhost:5000/api/chat/stream?text=${encodeURIComponent(text)}`;
      const es = new EventSource(url);

      es.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.status === "thinking") {
          return;
        }

        if (data.status === "done") {
          es.close();
          const chat = Array.isArray(data.chat) ? data.chat[0] : data.chat;
          console.log("[Redux] Resolved mascotData:", chat);
          resolve({ chat });
        }

        if (data.error) {
          es.close();
          reject(rejectWithValue(data.error));
        }
      };

      es.onerror = () => {
        es.close();
        reject(rejectWithValue("SSE connection lost. Please try again."));
      };
    });
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    mascotData: {
      msg: "Hi! I'm here to screen your tutoring skills. Ready to start?",
      expression: "happy",
      image: null,
    },
    status: "idle",
    error: null,
  },
  reducers: {
    resetChat: (state) => {
      state.mascotData = {
        msg: "Hi! I'm here to teach you. Ready to start?",
        expression: "happy",
        image: null,
      };
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "idle";
        state.mascotData = action.payload.chat;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong.";
      });
  },
});

export const { resetChat } = chatSlice.actions;
export default chatSlice.reducer;
