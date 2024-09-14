// TermsAndConditions.js
import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">Terms and Conditions</h1>
        <p className="text-sm text-gray-500 mb-6">Effective Date: <span className="text-gray-800 font-medium">14 September,2024</span></p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">1. Account Information</h2>
          <p className="text-gray-600">
            By registering on WisdomHub, you agree to provide accurate and truthful information. You are responsible for safeguarding your account credentials and any activity performed under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">2. User-Generated Content</h2>
          <p className="text-gray-600">
            Users are allowed to upload educational materials (e.g., books, question papers, study materials). By uploading content, you affirm that you own or have the right to share this material and that it is lawful.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">3. Public Information</h2>
          <p className="text-gray-600">
            The following user information is publicly visible:
          </p>
          <ul className="list-disc ml-8 text-gray-600 space-y-2">
            <li>Uploaded materials</li>
            <li>Avatar, username, email, and institute</li>
            <li>Role (student, teacher, etc.)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">4. Intellectual Property</h2>
          <p className="text-gray-600">
            All user-uploaded content remains the property of the uploader. However, by uploading, you grant WisdomHub a license to display and distribute the content on our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">5. Liability</h2>
          <p className="text-gray-600">
            WisdomHub is not liable for any damages resulting from the use of the website, including data breaches or unauthorized access to your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">6. Termination</h2>
          <p className="text-gray-600">
            We reserve the right to terminate accounts that violate our terms or engage in illegal activities.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">7. Governing Law</h2>
          <p className="text-gray-600">
            These Terms and Conditions are governed by the laws of India.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">8. Contact</h2>
          <p className="text-gray-600">
            If you have any questions or need further clarification, feel free to contact us at <a href="mailto:wisdomhubsmtp@gmail.com" className="text-indigo-600 underline">wisdomhubsmtp@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
