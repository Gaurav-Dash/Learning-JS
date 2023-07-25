import { useEffect, useState } from "react";
type Proptype = {
  name: string;
};

type User = {
  name: string;
  email: string;
};

export default function Greet({ name }: Proptype) {
  const [usr, setUsr] = useState<User | null>(null);
  useEffect(() => {
    setUsr({
      name: name,
      email: "something@something.com",
    });
  }, [name]);
  return (
    <div>
      Greetings!! {usr?.name} with {usr?.email}
    </div>
  );
}
