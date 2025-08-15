import {
    LogOut,
    User,
} from 'lucide-react';
import Button from '../components/Button';

export default function Header({user, handleLogout}) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 mr-3">
              {user?.role === 'admin' ? 'لوحة تحكم الادمن ' : 'لوحة تحكم العسكري '}
            </h1>
          </div>

            <div className="flex items-center text-sm sm:text-base lg:text-lg  space-x-4 space-x-reverse">
            <div className="text-right">
              {/* <p className="text-sm text-gray-600">مرحباً</p> */}
              <p className="font-medium text-gray-900">{user?.name}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="w-4 h-4 ml-1" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
