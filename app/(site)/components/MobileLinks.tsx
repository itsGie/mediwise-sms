import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type Props = {};
const MobileLinks = (props: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="md:hidden py-3">
          More <ChevronDown size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
        <DropdownMenuItem>
            <Link href="#home" className="px-5 py-3 font-semibold">
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#about-us" className="px-5 py-3 font-semibold">
              About us
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#guidelines" className="px-5 py-3 font-semibold">
              Guidelines
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#contact-us" className="px-5 py-3 font-semibold">
              Contact Us
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default MobileLinks;
