import AdminUsers from "./AdminUsers";
import AdminResumes from "./AdminResumes";
import AdminJobApplications from "./AdminJobApplications";
import AdminCompanies from "./AdminCompanies";
import AdminJobPosts from "./AdminJobPosts";

const AdminMain = () => {

    return (
        <div>
            <AdminUsers />
            <AdminResumes />
            <AdminJobApplications/>
            <AdminCompanies/>
            <AdminJobPosts/>
        </div>
    );
};

export default AdminMain;