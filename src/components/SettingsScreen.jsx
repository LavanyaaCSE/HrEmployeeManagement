import React, { useState } from 'react';

// Settings Component
const Settings = () => {
  const [companySettings, setCompanySettings] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    timeZone: 'UTC',
    currency: 'USD',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const [employeeSettings, setEmployeeSettings] = useState({
    allowSelfRegistration: false,
    maxLeavesPerYear: 20,
    attendanceTracking: true,
  });

  const [formStatus, setFormStatus] = useState('');

  // Handle input change for company settings
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanySettings({
      ...companySettings,
      [name]: value,
    });
  };

  // Handle input change for notification settings
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  // Handle input change for employee settings
  const handleEmployeeChange = (e) => {
    const { name, checked, value } = e.target;
    if (name === "maxLeavesPerYear") {
      setEmployeeSettings({
        ...employeeSettings,
        [name]: value,
      });
    } else {
      setEmployeeSettings({
        ...employeeSettings,
        [name]: checked,
      });
    }
  };

  // Handle form submission for saving settings
  const handleSaveSettings = (e) => {
    e.preventDefault();

    // Simulate an API call to save settings (this should be replaced with actual API call)
    setTimeout(() => {
      setFormStatus('Settings saved successfully!');
    }, 500);
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Employee Management Settings</h2>

      {/* Company Settings */}
      <section className="settings-section">
        <h3 className="section-title">Company Settings</h3>
        <form onSubmit={handleSaveSettings} className="settings-form">
          <div className="form-group">
            <label htmlFor="companyName">Company Name <span className="required">*</span></label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={companySettings.companyName}
              onChange={handleCompanyChange}
              required
              placeholder="Enter company name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyEmail">Company Email <span className="required">*</span></label>
            <input
              type="email"
              id="companyEmail"
              name="companyEmail"
              value={companySettings.companyEmail}
              onChange={handleCompanyChange}
              required
              placeholder="Enter company email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyPhone">Company Phone</label>
            <input
              type="tel"
              id="companyPhone"
              name="companyPhone"
              value={companySettings.companyPhone}
              onChange={handleCompanyChange}
              placeholder="Enter company phone"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyAddress">Company Address</label>
            <textarea
              id="companyAddress"
              name="companyAddress"
              value={companySettings.companyAddress}
              onChange={handleCompanyChange}
              placeholder="Enter company address"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="timeZone">Time Zone</label>
            <select
              id="timeZone"
              name="timeZone"
              value={companySettings.timeZone}
              onChange={handleCompanyChange}
              className="form-select"
            >
              <option value="UTC">UTC</option>
              <option value="PST">PST</option>
              <option value="EST">EST</option>
              <option value="GMT">GMT</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              name="currency"
              value={companySettings.currency}
              onChange={handleCompanyChange}
              className="form-select"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
        </form>
      </section>

      {/* Notification Settings */}
      <section className="settings-section">
        <h3 className="section-title">Notification Settings</h3>
        <div className="form-group">
          <label htmlFor="emailNotifications">Email Notifications</label>
          <input
            type="checkbox"
            id="emailNotifications"
            name="emailNotifications"
            checked={notificationSettings.emailNotifications}
            onChange={handleNotificationChange}
            className="form-checkbox"
          />
        </div>

        <div className="form-group">
          <label htmlFor="smsNotifications">SMS Notifications</label>
          <input
            type="checkbox"
            id="smsNotifications"
            name="smsNotifications"
            checked={notificationSettings.smsNotifications}
            onChange={handleNotificationChange}
            className="form-checkbox"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pushNotifications">Push Notifications</label>
          <input
            type="checkbox"
            id="pushNotifications"
            name="pushNotifications"
            checked={notificationSettings.pushNotifications}
            onChange={handleNotificationChange}
            className="form-checkbox"
          />
        </div>
      </section>

      {/* Employee Management Settings */}
      <section className="settings-section">
        <h3 className="section-title">Employee Management Settings</h3>

        <div className="form-group">
          <label htmlFor="allowSelfRegistration">Allow Self Registration</label>
          <input
            type="checkbox"
            id="allowSelfRegistration"
            name="allowSelfRegistration"
            checked={employeeSettings.allowSelfRegistration}
            onChange={handleEmployeeChange}
            className="form-checkbox"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxLeavesPerYear">Max Leaves Per Year</label>
          <input
            type="number"
            id="maxLeavesPerYear"
            name="maxLeavesPerYear"
            value={employeeSettings.maxLeavesPerYear}
            onChange={handleEmployeeChange}
            className="form-input"
            placeholder="Enter max leaves"
          />
        </div>

        <div className="form-group">
          <label htmlFor="attendanceTracking">Enable Attendance Tracking</label>
          <input
            type="checkbox"
            id="attendanceTracking"
            name="attendanceTracking"
            checked={employeeSettings.attendanceTracking}
            onChange={handleEmployeeChange}
            className="form-checkbox"
          />
        </div>
      </section>

      {/* Save Button and Feedback */}
      <div className="form-group">
        <button type="submit" onClick={handleSaveSettings} className="save-button">
          Save Settings
        </button>
      </div>

      {/* Feedback Message */}
      {formStatus && <div className="form-feedback">{formStatus}</div>}
    </div>
  );
};

export default Settings;
