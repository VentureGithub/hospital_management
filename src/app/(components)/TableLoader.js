import styles from '@/app/styles/SkeletonLoader.module.css'

const TableLoader = () => {
  return (
    <div className='p-6'>
      <div className='p-7'>
        <div className={styles.skeletonContainer} >
          <table className='table-auto w-full border border-collapse shadow'>
            <thead>
              <tr>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
                <td className="px-4 py-2 border border-gray-200"> <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div></td>
              </tr>
            </tbody>
          </table>
          {/*            
            <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div>
            <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div>
            <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div>
            <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div>
            <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div>
            <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div>
            <div className={styles.skeletonItem} style={{ paddingTop: "2px" }}></div> */}
        </div>
      </div>
    </div>
  )
}

export default TableLoader 