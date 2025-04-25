import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import { activateUser } from '@/utils/actions/authActions';
import { CheckCircle, Info, ShieldAlert } from 'lucide-react';

interface ActivationProps {
    params: {
        token: string;
    };
}

const ActivationPage = async ({ params }: ActivationProps) => {
    const result = await activateUser(params.token);

    return (
        <MaxWidthWrapper>
            <div className="fixed-height flex flex-col items-center justify-center font-Gentium">
                {result === 'userNotExist' ? (
                    <div className="flex flex-col gap-3 h-full justify-center items-center">
                        <ShieldAlert className="w-16 h-16 text-red-400" />
                        <span className="text-2xl text-red-500 font-semibold">User does not Exist</span>
                    </div>
                ) : result === 'alreadyActivated' ? (
                    <div className="flex flex-col gap-3 h-full justify-center items-center">
                        <Info className="w-16 h-16 text-blue-400" />
                        <p className="text-2xl text-blue-500 font-semibold">Your Account is already activated</p>
                    </div>
                ) : result === 'success' ? (
                    <div className="flex flex-col gap-3 h-full justify-center items-center">
                        <CheckCircle className="w-16 h-16 text-green-400" />
                        <p className="text-2xl text-green-500 font-semibold">Your Account is Activated</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 h-full justify-center items-center">
                        <ShieldAlert className="w-16 h-16 text-red-400" />
                        <p className="text-2xl text-red-500 font-semibold">Oops! Something went Wrong</p>
                    </div>
                )}
            </div>
        </MaxWidthWrapper>
    );
};

export default ActivationPage;
