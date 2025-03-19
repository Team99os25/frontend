import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Privacy Policy</h1>
            <p className="text-gray-600 text-lg leading-relaxed text-center">
                Welcome to <strong className="text-primary">OpenSoft</strong>. Your privacy is important to us, and we are committed to protecting your personal information.
            </p>

            <p className="text-gray-600 text-center text-sm mt-12">
                © {new Date().getFullYear()} <strong>OpenSoft</strong>. All Rights Reserved.
            </p>
        </div>
    );
};

export default PrivacyPolicy;