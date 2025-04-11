import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  ViewList as ViewListIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// Drawer width for the sidebar
const drawerWidth = 240;

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Admin navigation items
  const menuItems = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/admin" },
    { text: "Properties", icon: <BusinessIcon />, path: "/properties" },
    { text: "Add Property", icon: <AddIcon />, path: "/admin/add-property" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Buyers", icon: <PersonIcon />, path: "/admin/buyers" },
    { text: "Buyer Lists", icon: <ViewListIcon />, path: "/admin/buyer-lists" },
    { text: "Qualifications", icon: <AssessmentIcon />, path: "/admin/qualifications" },
  ];

  return (
    <div className="bg-[#FDF8F2] text-[#333] min-h-screen flex flex-col">
      {/* Use the same Header component as the main layout */}
      <header className="sticky top-0 z-50 w-full bg-[#FDF8F2]">
        <Header />
      </header>

      <div className="flex flex-grow">
        {/* Admin Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#f5f5f5",
              borderRight: "1px solid #e0e0e0",
              marginTop: "80px", // Adjust based on Header height
            },
          }}
          open={open}
        >
          <Box sx={{ display: "flex", alignItems: "center", padding: "8px 16px" }}>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>Admin</Typography>
          </Box>
          
          <Divider />
          
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#e8efdc",
                    borderLeft: "4px solid #3f4f24",
                    "&:hover": {
                      backgroundColor: "#e8efdc",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#f4f7ee",
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: location.pathname === item.path ? "#3f4f24" : "#757575" 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    color: location.pathname === item.path ? "#3f4f24" : "#424242",
                    "& .MuiTypography-root": { 
                      fontWeight: location.pathname === item.path ? "bold" : "normal" 
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 3,
            backgroundColor: "#fff",
            minHeight: "calc(100vh - 160px)", // Adjust for Header and Footer
          }}
        >
          <Outlet />
        </Box>
      </div>

      {/* Use the same Footer component as the main layout */}
      <footer className="bg-[#EFE8DE]">
        <Footer />
      </footer>
    </div>
  );
}