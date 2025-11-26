import axios from "axios";

const BASE_URL = "http://localhost:8081/api/notifications";


export const sendOtp = async (email) => {
  try {
    const url = `${BASE_URL}/send-otp`;
    console.log("Send OTP URL:", url);

    const response = await axios.post(url, {
      to: email,
    });

    console.log("OTP Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};


export const verifyOtp = async (email, otp) => {
  try {
    const url = `${BASE_URL}/verify-otp`;

    const response = await axios.post(url, {
      to: email,
      otp,
    });

    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw error;
  }
};

export const onboardingEmail = async (email,subject) => {
  try {
    const url = `${BASE_URL}/send-onboarding`;

    const response = await axios.post(url, {
      to: email,
      subject:subject,
    });

    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw error;
  }
};
