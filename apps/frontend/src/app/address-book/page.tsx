import AddressBookContainer from "@/components/AddressBook/AddressBookContainer";
import AddressCard from "@/components/AddressBook/AddressCard";

export default function AddressBookPage() {
  return (
    <div className="flex flex-row gap-1 h-full bg-app-background">
      <AddressBookContainer className="flex-2" />
      <AddressCard contact={{ name: "Tim Cook", address: "0xd...s78", company: "Apple" }} className="flex-1" />
    </div>
  );
}
