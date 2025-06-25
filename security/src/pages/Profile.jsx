import Header from '../components/Header';
import ProfileHeader from '../components/ProfileHeader';

const Profile = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-4 pt-28 pb-2">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <ProfileHeader />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
