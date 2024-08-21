export interface ModalProps {
  isActive: boolean;
  canClose: boolean;
  title: string;
  content: string | JSX.Element;
}