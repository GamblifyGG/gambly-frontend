import Left from "@/components/basic/icons/left";
import Right from "@/components/basic/icons/right";

const NavigationButtons = ({
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="flex gap-5">
      <div
        className="rounded-md bg-main pt-2 pb-2 pl-3 pr-3 arrow-new-left cursor-pointer"
        onClick={onDecrease}
      >
        <Left />
      </div>
      <div
        className="rounded-md bg-main pt-2 pb-2 pl-3 pr-3 arrow-new-right cursor-pointer"
        onClick={onIncrease}
      >
        <Right />
      </div>
    </div>
  );
};

export default NavigationButtons;