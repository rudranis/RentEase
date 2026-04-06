import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiCamera, FiEdit2, FiLogOut, FiStar, FiUser, FiMapPin, FiMail, FiPhone, FiChevronRight, FiPackage, FiMessageCircle } from "react-icons/fi";
import { logout, setUser } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfile();
    window.scrollTo(0, 0);
  }, [user, token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/profile/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const profileData = response.data.user;
      setProfile(profileData);
      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
        bio: profileData.bio || "",
        address: profileData.location?.address || "",
        city: profileData.location?.city || "",
        state: profileData.location?.state || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
        },
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(setUser(response.data.user));
      toast.success("Profile updated");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataObj = new FormData();
    formDataObj.append("avatar", file);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile/avatar`,
        formDataObj,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      toast.success("Avatar updated");
      fetchProfile();
    } catch (error) {
      toast.error("Failed to upload avatar");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="flex justify-center items-center h-screen pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-24">
        {/* Profile Card */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-purple-500/5 border border-gray-100 overflow-hidden mb-10">
          <div className="h-40 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 relative">
            <button
              onClick={() => setEditing(!editing)}
              className="absolute top-8 right-8 glass px-6 py-2.5 rounded-2xl font-black text-sm text-primary hover:bg-white transition-all shadow-lg"
            >
              {editing ? "Discard Changes" : "Edit Identity"}
            </button>
          </div>
          
          <div className="px-10 pb-12 relative flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar Section */}
            <div className="-mt-16 relative flex-shrink-0">
              <div className="w-40 h-40 rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden bg-gray-100 relative group">
                <img
                  src={profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || "")}&background=7C3AED&color=fff&size=200`}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FiCamera className="text-white text-3xl" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 pt-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-4xl font-black text-gray-900 mb-1 tracking-tight">{profile?.name}</h1>
                  <div className="flex items-center gap-4 text-gray-400 font-bold text-sm italic uppercase tracking-wider">
                     <span className="flex items-center gap-1.5"><FiMail size={14} className="text-primary"/> {profile?.email}</span>
                     {profile?.phone && <span className="flex items-center gap-1.5"><FiPhone size={14} className="text-primary"/> {profile.phone}</span>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-primary/5 px-6 py-3 rounded-2xl text-center border border-primary/10">
                    <p className="text-[10px] font-black text-primary uppercase mb-0.5">Community Trust</p>
                    <div className="flex items-center gap-1.5 justify-center font-black text-gray-900">
                      <FiStar className="text-yellow-400 fill-yellow-400" size={16}/>
                      {profile?.ratings?.average?.toFixed(1) || "5.0"}
                    </div>
                  </div>
                </div>
              </div>

              {profile?.bio && !editing && (
                <div className="p-6 bg-gray-50 rounded-[2rem] italic text-gray-600 font-medium leading-relaxed mb-6 border border-gray-100/50">
                   "{profile.bio}"
                </div>
              )}

              {profile?.location?.city && !editing && (
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                    <FiMapPin className="text-primary" /> {profile.location.city}, {profile.location.state}
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Section: Edit or Quick Actions */}
        {editing ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass p-10 rounded-[3rem] shadow-2xl">
            <h2 className="text-2xl font-black mb-8 italic">Update Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6 md:col-span-2">
                <div>
                  <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Full Display Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Bio / Description</label>
                  <textarea rows={3} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl font-bold resize-none" placeholder="Tell the community about yourself..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">Contact Phone</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black text-primary uppercase mb-2 tracking-widest">City Target</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl font-bold" />
              </div>
            </div>
            <div className="mt-10 flex gap-4">
              <button onClick={handleUpdate} disabled={saving} className="btn-primary flex-1 py-4 text-lg italic shadow-primary/30">
                {saving ? "Updating Cloud..." : "Finalize Changes"}
              </button>
              <button onClick={handleLogout} className="px-8 py-4 bg-red-50 text-red-500 rounded-2xl font-black italic hover:bg-red-500 hover:text-white transition-all">
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => navigate("/my-listings")} className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 card-hover text-left flex flex-col justify-between h-56">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><FiPackage size={28}/></div>
                <div>
                  <h3 className="font-black text-xl text-gray-900 mb-1">Stockhouse</h3>
                  <p className="text-sm font-bold text-gray-400 italic">Manage items for rent <FiChevronRight className="inline ml-1 opacity-0 group-hover:opacity-100 transition-all"/></p>
                </div>
            </button>
            <button onClick={() => navigate("/my-bookings")} className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 card-hover text-left flex flex-col justify-between h-56">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform"><FiStar size={28}/></div>
                <div>
                  <h3 className="font-black text-xl text-gray-900 mb-1">Rental Logs</h3>
                  <p className="text-sm font-bold text-gray-400 italic">Track activity status <FiChevronRight className="inline ml-1 opacity-0 group-hover:opacity-100 transition-all"/></p>
                </div>
            </button>
            <button onClick={() => navigate("/chat")} className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 card-hover text-left flex flex-col justify-between h-56">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform"><FiMessageCircle size={28}/></div>
                <div>
                  <h3 className="font-black text-xl text-gray-900 mb-1">Hyper Chat</h3>
                  <p className="text-sm font-bold text-gray-400 italic">Secure messaging <FiChevronRight className="inline ml-1 opacity-0 group-hover:opacity-100 transition-all"/></p>
                </div>
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;