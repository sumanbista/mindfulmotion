import React from 'react';

const Settings = () => {
  return (

    <div>
      {/* Profile Section */}
      < div className="w-1/3 flex flex-col items-center justify-center p-6" >
        <img
          src="https://via.placeholder.com/100"
          alt="profile"
          className="w-24 h-24 rounded-full shadow-md"
        />
        <h3 className="text-xl font-semibold mt-4">Alex Serenity</h3>
        <p className="text-gray-500">"Finding peace within the chaos"</p>
      </div >

      {/* Settings Form */}
      < div className="w-2/5 bg-white p-6 rounded-xl shadow-lg" >
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
        <label className="block mb-2">Username</label>
        <input type="text" className="w-full p-2 border rounded-lg bg-gray-200" value="Alex.Serenity" disabled />

        <label className="block mt-4 mb-2">Email</label>
        <input type="email" className="w-full p-2 border rounded-lg bg-gray-200" value="alex@example.com" disabled />

        <label className="block mt-4 mb-2">Password</label>
        <input type="password" className="w-full p-2 border rounded-lg" placeholder="********" />

        <div className="mt-4">
          <label className="block mb-2">Notifications</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Email
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Push Notifications
            </label>
          </div>
        </div>

        <button className="w-full mt-6 bg-gray-400 p-2 rounded-lg text-white hover:bg-gray-500">
          Save Changes
        </button>
      </div >
    </div>
  );
};

export default Settings;
