// import React, { useState } from "react";
// import { LoginData, User } from "../types/User";
// import { loginUser } from "../services/userApi"; // Import the login function from UserAPI

// // Account details component
// const AccountDetails: React.FC<{
//   user: User;
//   onLogout: () => void;
// }> = ({ user, onLogout }) => (
//   <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
//     <h2 className="text-3xl font-semibold mb-6">Account Details</h2>
//     <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
//     <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
//     <p><strong>Email:</strong> {user.email}</p>
//     <p><strong>Role:</strong> {user.role === "ADMIN" ? "Administrator" : "Customer"}</p>
//     <button
//       onClick={onLogout}
//       className="mt-4 w-full bg-red-500 text-white px-4 py-3 rounded-md hover:bg-red-600 transition duration-300"
//     >
//       Logout
//     </button>
//     {user.role === "ADMIN" && (
//       <div className="mt-4">
//         <h3 className="text-xl">Admin Panel</h3>
//         <p>Manage users and content here.</p>
//       </div>
//     )}
//     {user.role === "CUSTOMER" && (
//       <div className="mt-4">
//         <h3 className="text-xl">User Dashboard</h3>
//         <p>View your bookings and account details here.</p>
//       </div>
//     )}
//   </div>
// );

// const AccountPage: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "", role: "customer" });
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<"customer" | "admin">("customer");

//   const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLoginData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleLogin = async (loginData: LoginData) => {
//     if (!loginData.email || !loginData.password) {
//       setError("Please enter both email and password.");
//       return;
//     }

//     try {
//       const { user, token } = await loginUser(loginData); // Use the loginUser function from UserAPI
//       localStorage.setItem("token", token); // Save JWT token
//       setUser(user);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || "An error occurred during login. Please try again.");
//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setLoginData({ email: "", password: "", role: "customer" }); // Reset role to "customer"
//   };

//   return (
//     <div className="flex justify-center items-center min-h-full bg-gray-100">
//       <div className="w-full max-w-screen-md p-6">
//         {!user && (
//           <div className="flex justify-center mb-6">
//             {["customer", "admin"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab as "customer" | "admin");
//                   setLoginData((prevData) => ({ ...prevData, role: tab as "customer" | "admin" }));
//                 }}
//                 className={`px-4 py-2 mr-2 rounded-md text-white font-semibold ${activeTab === tab ? "bg-blue-500" : "bg-gray-300"}`}
//               >
//                 {tab === "customer" ? "Customer Login" : "Admin Login"}
//               </button>
//             ))}
//           </div>
//         )}

//         {user ? (
//           <AccountDetails user={user} onLogout={handleLogout} />
//         ) : (
//           <LoginForm
//             onLogin={handleLogin}
//             error={error}
//             loginData={loginData}
//             handleChange={handleLoginChange}
//             activeTab={activeTab}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AccountPage;
