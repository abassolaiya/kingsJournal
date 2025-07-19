export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error("API Error Response:", error.response.data);
    console.error("Status Code:", error.response.status);
    console.error("Headers:", error.response.headers);
    return error.response.data.message || "An error occurred";
  } else if (error.request) {
    // The request was made but no response was received
    console.error("API Request Error:", error.request);
    return "No response received from server";
  } else {
    // Something happened in setting up the request
    console.error("API Setup Error:", error.message);
    return "Error setting up request";
  }
};
