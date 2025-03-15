Follow the instructions from *DAT220* to install and set up MySQL. 

Add the following configuration to the `src/Gui.API/appsettings.json` file:

```json
  "ConnectionStrings": {
    "MySqlConnection": "server=localhost;port=3306;database=yourdatabase;user=youruser;password=yourpassword"
  },
```

Make sure to replace `yourdatabase`, `youruser`, and `yourpassword` with your actual database name, username, and password.
