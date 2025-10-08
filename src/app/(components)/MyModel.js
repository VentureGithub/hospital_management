import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import Heading from './heding';

const customStyles = {
  content: {
    width: '75%',
    height: 'auto',
    margin: 'auto', // Center modal horizontally and vertically
    top: '50%',     // Position from the center vertically
    left: '40%',    // Position from the center horizontally
    transform: 'translate(-50%, -50%)', // Translate back to center
    padding: '0',
    position: 'relative',
  
  },
};


const MyModal = ({ isOpen, closeModal, children, heading }) => {
  return (
      <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
      >
         <div style={{textAlign:'right', paddingRight:'30px'}}><a href='#' onClick={closeModal}><FontAwesomeIcon icon={faClose} ></FontAwesomeIcon></a></div>
          <Heading headingText={heading}></Heading>
          {children}
      </Modal>
  );
};

export default MyModal;