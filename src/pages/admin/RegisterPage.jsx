import { UserPlus } from "lucide-react"
import { PageHeader } from "./components/FormFields"

const RegisterPage = () => (
    <>
        <PageHeader
            title="Register"
            description="Manage staff accounts and registrations."
        />
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5">
                <UserPlus className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-white font-semibold text-lg mb-2">Coming Soon</h2>
            <p className="text-gray-500 text-sm max-w-xs">
                Staff registration and account management will be available here.
            </p>
        </div>
    </>
)

export default RegisterPage
