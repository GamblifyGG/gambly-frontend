import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo-letter.png"
      width={60}
      height={60}
      alt="G"
    />
  );
}
