import IconLoader from "../../components/icons/icon-refresh";

interface ScreenLoaderProps {
  text: string;
}

const ScreenLoader: React.FC<ScreenLoaderProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center text-xl font-light text-gray-400 h-96">
      <div className="text-center">
        <IconLoader animate={true} className="w-12 h-12 mx-auto" />
        <div className="mx-auto">{text}</div>
      </div>
    </div>
  );
};

export default ScreenLoader;
