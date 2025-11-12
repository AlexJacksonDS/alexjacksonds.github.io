import { Toast, ToastContainer } from "react-bootstrap";

export default function ErrorToast(props: {
  name: string;
  showError: boolean;
  onClose: () => void;
  errorString: string;
}) {
  return (
    <ToastContainer position="middle-center">
      <Toast
        bg={"danger"}
        show={props.showError}
        onClose={() => props.onClose()}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">{props.name}</strong>
          <small className="text-muted">Just now</small>
        </Toast.Header>
        <Toast.Body>{props.errorString}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
