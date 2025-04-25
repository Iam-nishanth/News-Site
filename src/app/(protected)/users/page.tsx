import AdminWrapper from '@/components/admin-components/AdminWrapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { getUsers } from '@/utils/actions/adminActions';
import { User } from '@prisma/client';
import { verifyUser } from '@/utils/actions/authActions';
import UserTable from '@/views/UserTable';

async function getData() {
    const data = await getUsers();
    if (data) return data;
}

// export async function GetUser() {
//   const { user } = await verifyUser();
//   return { data: user };
// }

export default async function Users() {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const role = session?.user.role;

    if (role && role !== 'SUPERADMIN' && role !== 'ADMIN') redirect('/preview');

    let filteredData: User[] = [];

    const data = await getData();
    if (data) {
        filteredData = data.filter((user) => user.id !== userId);
    }

    // Ensure filteredData is an array before rendering
    // if (!Array.isArray(filteredData)) {
    //   console.error("filteredData is not an array:", filteredData);
    //   return <div>Error: Data is not in the expected format.</div>;
    // }

    return <AdminWrapper>{filteredData.length > 0 && <UserTable data={filteredData} />}</AdminWrapper>;
}
