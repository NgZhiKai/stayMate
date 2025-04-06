import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateUser, deleteUser } from "../services/userApi";
import { AuthContext } from "../contexts/AuthContext";
import AccountSettingsForm from "../components/User/AccountSettingsForm";
import MessageModal from "../components/MessageModal"; // Import MessageModal

const UserAccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [newEmail, setNewEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const openModal = (message: string, type: "success" | "error") => {
    setModalMessage(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (userId) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const { user } = await getUserInfo(userId);
          setUserInfo({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
          });
          setLoading(false);
        } catch (err: unknown) {
          setLoading(false);
          openModal(
            err instanceof Error ? err.message : "An unknown error occurred.",
            "error"
          );
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
      openModal("User not logged in.", "error");
    }
  }, []);

  const handleEmailChange = async () => {
    if (newEmail.trim() !== "") {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          throw new Error("User not logged in.");
        }

        const updatedUser = {
          firstName: userInfo.name.split(" ")[0],
          lastName: userInfo.name.split(" ")[1],
          email: newEmail,
          phoneNumber: userInfo.phoneNumber,
          role: userInfo.role,
        };

        await updateUser(userId, updatedUser);
        setUserInfo((prev) => ({ ...prev, email: newEmail }));
        setNewEmail("");
        openModal("Email updated successfully!", "success");
      } catch (error) {
        openModal(error instanceof Error ? error.message : "An error occurred.", "error");
      }
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.currentPassword && passwords.newPassword) {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          throw new Error("User not logged in.");
        }

        const updatedUser = {
          firstName: userInfo.name.split(" ")[0],
          lastName: userInfo.name.split(" ")[1],
          email: userInfo.email,
          password: passwords.newPassword,
          phoneNumber: userInfo.phoneNumber,
          role: userInfo.role,
        };

        await updateUser(userId, updatedUser);
        setPasswords({ currentPassword: "", newPassword: "" });
        openModal("Password changed successfully!", "success");
      } catch (error) {
        openModal(error instanceof Error ? error.message : "An error occurred.", "error");
      }
    }
  };

  const handleDeleteAccount = async () => {
    const userId = sessionStorage.getItem("userId");

    if (userId && window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await deleteUser(userId);
        alert(response.message);
        logout();
        navigate("/");
      } catch (err) {
        alert(err instanceof Error ? err.message : "An error occurred while deleting the account.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-full bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg">
        <AccountSettingsForm
          userInfo={userInfo}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          passwords={passwords}
          setPasswords={setPasswords}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
          handleDeleteAccount={handleDeleteAccount}
        />
      </div>

      {/* Modal Popup for Success/Error Message */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default UserAccountSettings;
