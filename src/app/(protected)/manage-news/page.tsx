import React from 'react';
import AdminWrapper from '@/components/admin-components/AdminWrapper';
import { getNews } from '@/utils/actions/adminActions';
import { verifyUser } from '@/utils/actions/authActions';
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function page() {
    const { user } = await verifyUser();
    const data = await getNews();

    if (data)
        return (
            <AdminWrapper>
                <DataTable columns={columns} data={data ? data : []} filterBy="title" />
            </AdminWrapper>
        );
}
