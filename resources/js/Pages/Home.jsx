import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';

export default function Home({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Home" />
            <AuthenticatedLayout
                user={auth.user}
            >
            </AuthenticatedLayout>
        </>
    );
}
