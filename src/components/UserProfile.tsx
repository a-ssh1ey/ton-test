import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserProfileProps {
  botToken: string;
  userId: string | number;
}

const UserProfile: React.FC<UserProfileProps> = ({ botToken, userId }) => {
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    console.log("Fetching data for userId:", userId); // Debugging line

    // Fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");

        // Get user profile information
        const userResponse = await axios.get(
          `https://api.telegram.org/bot${botToken}/getChat?chat_id=${userId}`
        );

        console.log("User data fetched:", userResponse.data.result); // Debugging line

        if (userResponse.data.result) {
          setUserName(userResponse.data.result.first_name);
        } else {
          setError("Failed to fetch user name");
        }

        // Get user profile photos
        const photosResponse = await axios.get(
          `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`
        );

        console.log("Photos data fetched:", photosResponse.data.result); // Debugging line

        if (
          photosResponse.data.result.photos &&
          photosResponse.data.result.photos.length > 0
        ) {
          const fileId =
            photosResponse.data.result.photos[0][0].file_id; // Get the file_id of the smallest photo

          // Get the file path
          const fileResponse = await axios.get(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
          );
          const filePath = fileResponse.data.result.file_path;
          const avatarUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

          console.log("Avatar URL:", avatarUrl); // Debugging line

          setUserAvatar(avatarUrl);
        } else {
          setError("No profile photos found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [botToken, userId]);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <img src={userAvatar} alt="User Avatar" style={styles.avatar} />
      <p style={styles.name}>{userName}</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    position: "absolute" as "absolute",
    top: "10px",
    left: "10px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  name: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
  },
};

export default UserProfile;
