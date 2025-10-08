import Sidebar_Master from "../(components)/sidebar_master";
const LayoutMaster = ({ children }) => {
    return (
        <div className='dashboard flex h-screen'>
            <Sidebar_Master />
            <div className='flex-1'>
                {children}
            </div>
        </div>
    );
}

export default LayoutMaster;