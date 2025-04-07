// "use client";

// import { SidenavProps } from "@/app/(HR)/hr-dashboard/page";
// import { Button, Drawer, List, ListItem, ListItemText } from "@mui/material";
// import { useState } from "react";

// const Sidenav: React.FC<SidenavProps> = ({
//   elements = []
// }) => {

//   const [open, setOpen] = useState(false);

//   return (  
//   <div>
//     {/* <Button onClick={() => setOpen(true)} sx={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}>
//       <MenuIcon fontSize="large" />
//     </Button> */}
//       <Drawer variant="temporary" anchor="left" open={open} onClose={() => setOpen(false)}>
//         <List>
//           {elements.map((item) => (
//             <ListItem component="button" key={item} onClick={() => setOpen(false)}>
//               <ListItemText primary={item} />
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>
//     </div>
//   );
// }
 
// export default Sidenav;