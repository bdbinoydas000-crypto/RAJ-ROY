
import React, { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import PolicyModal from './PolicyModal';

const Footer: React.FC = () => {
    const { t } = useLocalization();
    const [policyContent, setPolicyContent] = useState<{ title: string; content: string } | null>(null);

    const policies = {
        terms: {
            title: "Terms & Conditions",
            content: "These are the terms and conditions. By using our service, you agree to them. All sales are final. Custom orders cannot be changed once processing begins. We reserve the right to refuse service."
        },
        cancellation: {
            title: "Cancellation Policy",
            content: "Orders can be cancelled within 2 hours of placement. After this period, customization begins and cancellation is not possible. To cancel, please contact our support team immediately."
        },
        noReturn: {
            title: "Return Policy",
            content: "Due to the personalized nature of our products, we have a strict no-return policy. All sales are final. If your item arrives damaged, please contact us within 24 hours with photos of the damage."
        }
    };

    const showPolicy = (key: keyof typeof policies) => {
        setPolicyContent(policies[key]);
    };
    
    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-gray-500">
                <div className="flex justify-center space-x-6 mb-4">
                    <button onClick={() => showPolicy('terms')} className="hover:text-purple-400 transition-colors">Terms & Conditions</button>
                    <button onClick={() => showPolicy('cancellation')} className="hover:text-purple-400 transition-colors">Cancellation Policy</button>
                    <button onClick={() => showPolicy('noReturn')} className="hover:text-purple-400 transition-colors">Return Policy</button>
                </div>
                <p>&copy; {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved')}.</p>
            </div>
            {policyContent && (
                <PolicyModal 
                    title={policyContent.title} 
                    content={policyContent.content}
                    onClose={() => setPolicyContent(null)}
                />
            )}
        </footer>
    );
};

export default Footer;
