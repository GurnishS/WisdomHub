// // Helper function to handle API requests with cookies
// async function fetchWithCookies(url, options = {}) {
//   // Get accessToken and refreshToken from cookies
//   const accessToken = getCookie("accessToken");
//   const refreshToken = getCookie("refreshToken");

//   // If tokens exist, add them to headers
//   const headers = {};
//   if (accessToken) {
//     headers["Authorization"] = `Bearer ${accessToken}`;
//   }

//   // Include credentials to send cookies
//   options.credentials = "include";

//   // Merge headers from options with tokens
//   options.headers = {
//     ...options.headers,
//     ...headers,
//   };

//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Fetch error:", error);
//     throw error;
//   }
// }

// // Example usage:
// async function checkLoggedIn() {
//   try {
//     const userData = await fetchWithCookies(
//       "http://localhost:8000/api/v1/users/current-user"
//     );
//     console.log("Current User:", userData);
//   } catch (error) {
//     console.error("Error checking logged in status:", error);
//     // Handle error, such as displaying an error message or redirecting to login page
//   }
// }

// // Helper function to get cookie by name
// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
// }

// // Call the function to check logged in status when needed
// export default checkLoggedIn;
