import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = ({ botToken, userId }) => {
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    // Получение данных о пользователе при монтировании компонента
    const fetchUserData = async () => {
      try {
        // Получение имени пользователя
        const userResponse = await axios.get(
          `https://api.telegram.org/bot${botToken}/getChat?chat_id=${userId}`
        );
        setUserName(userResponse.data.result.first_name || "Unknown User");

        // Получение аватара пользователя
        const photosResponse = await axios.get(
          `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`
        );

        if (
          photosResponse.data.result.photos &&
          photosResponse.data.result.photos.length > 0
        ) {
          const fileId = photosResponse.data.result.photos[0][0].file_id;
          const fileResponse = await axios.get(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
          );
          const avatarUrl = `https://api.telegram.org/file/bot${botToken}/${fileResponse.data.result.file_path}`;
          setUserAvatar(avatarUrl);
        } else {
          setUserAvatar(""); // Если фото нет, устанавливаем пустое значение
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [botToken, userId]); // Этот эффект будет выполняться только при изменении botToken или userId

  return (
    <div className="user-profile">
      {userAvatar ? (
        <img src={userAvatar} alt="User Avatar" width="50" height="50" />
      ) : (
        <p>No Avatar</p>
      )}
    </div>
  );
};

export default UserProfile;
