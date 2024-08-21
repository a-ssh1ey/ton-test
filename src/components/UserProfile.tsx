import React, { useEffect, useState } from "react";
import axios from "axios";
import  "./UserProfile.css";

interface UserProfileProps {
  botToken: string;
  userId: string | number;
}

const UserProfile: React.FC<UserProfileProps> = ({ botToken, userId }) => {
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");

  useEffect(() => {
    // Fetch user data when the component is first mounted
    const fetchUserData = async () => {
      try {
        // Fetch user name
        const userResponse = await axios.get(
          `https://api.telegram.org/bot${botToken}/getChat?chat_id=${userId}`
        );
        setUserName(userResponse.data.result.first_name || "Unknown User");

        // Fetch user avatar
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
          setUserAvatar(""); // Fallback if no photo is available
        }
      } catch (error) {
       
      }
    };

    fetchUserData();
  }, [botToken, userId]); // Dependency array ensures this runs only when userId changes (i.e., on first load)
  
  return (
    <div>
      <p>UserId: {userId}</p>
      <p>Name: {userName}</p>
      {userAvatar ? (
        <img src={userAvatar} alt="User Avatar" width="50" height="50" />
      ) : (
        <p>No Avatar</p>
      )}
    </div>
  );
};

export default UserProfile;
