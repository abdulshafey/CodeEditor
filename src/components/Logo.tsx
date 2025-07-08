import Image from "next/image";
import Link from "next/link";

const Logo = ({ w, h }: { w?: number; h?: number }) => {
  return (
    <Link href={"/"}>
      <Image src={"/logo.png"} width={w ?? 120} height={h ?? 50} alt="logo" />
    </Link>
  );
};

export default Logo;
