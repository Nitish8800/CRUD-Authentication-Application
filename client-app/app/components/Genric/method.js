import axios from "axios";

const paths = async (path, method, data, token, contentType) => {
  let headers = {
    Authorization: token,
  };

  if (contentType === "application/json") {
    headers["Content-Type"] = "application/json";
  } else if (contentType === "multipart/form-data") {
    headers["Content-Type"] = "multipart/form-data";
  } // Add more conditions if needed

  return await axios({
    method: method,
    url: `${process.env.NEXT_PUBLIC_HOST}${path}`,
    data: data,
    headers: headers,
  });
};

const apiPaths = {
  login: "/users/login",
  signup: "/users/signup",
  allUsers: "/users",
  logout: "/users/logout",
  updateMeUser: "/users/me/update",
};

const login = (loginData) => {
  let response = paths(
    apiPaths.login,
    "post",
    loginData,
    null,
    "application/json"
  );
  return response;
};

const register = (signupData) => {
  let response = paths(
    apiPaths.signup,
    "post",
    signupData,
    null,
    "application/json"
  );
  return response;
};

const getAllUsersData = (accessToken) => {
  let response = paths(apiPaths.allUsers, "get", null, accessToken, null);
  return response;
};

const logout = () => {
  let response = paths(apiPaths.logout, "delete");
  return response;
};

const deleteUser = (token, userId) => {
  const createDeleteUserPath = `${apiPaths.allUsers}/${userId}`;

  let response = paths(createDeleteUserPath, "delete", null, token, null);

  return response;
};

const getSingleUser = (token) => {
  const createGetUserPath = `${apiPaths.allUsers}/me`;

  let response = paths(createGetUserPath, "get", null, token, null);

  return response;
};

const updateMeUser = (updateData, token) => {
  const createGetUserPath = `${apiPaths.allUsers}/me/update`;

  let response = paths(
    createGetUserPath,
    "put",
    updateData,
    token,
    "application/json"
  );

  return response;
};

export {
  register,
  login,
  logout,
  getAllUsersData,
  deleteUser,
  updateMeUser,
  getSingleUser,
};
