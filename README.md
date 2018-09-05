# MXDial IoT DevKit Sample

In this PaaS demo solution you will setup and connect an Azure IoT DevKit device to the Azure IoT Hub and view sensor readings in a custom web application. The purpose of the demo is to showcase how the Azure IoT Hub is able to process messages in real-time from tangible devices. The demo also covers communicating to the device via Direct Methods and integrating to 3rd party API’s.

This repository contains a step-by-step guide on how to deploy your own instance of the demo. 

## Introduction

The source code in this repository contains the following:
* React Frontend Web Application
* .NET WebApi
* C++ Arduino Project

This tutorial will focus on setting up the required Azure services and consuming them within each of the applications to create an e2e solution that is focussed around the Azure IoT Hub. The below image outlines the high-level architecture of the solution.

![](https://devkitfiles.blob.core.windows.net/github/paas-arch.png)

## Environment Setup
### Prerequisites 
1. Windows 10
1. MXChip IoT DevKit AZ3166 ([Link](http://mxchip.com/az3166))
1. Visual Studio 2017 or later ([Link](https://visualstudio.microsoft.com/)).
1. Azure subscription ([Link](https://azure.microsoft.com/en-us/free/)).
1. Twitter account ([Link](https://twitter.com/i/flow/signup))
1. Yarn Package Manager ([Link](https://yarnpkg.com/en/docs/install#windows-stable))

All additional software that is required will be installed via the Install IoT DevKit Environment step later in the guide.

### Download Lab Material

If you have git installed, you can run the following command: `git clone https://github.com/Microsoft/MXDial-IoT-Sample.git`

Alternatively, you can download the material directly: [Download Material](https://github.com/Microsoft/MXDial-IoT-Sample/archive/master.zip)

### Install IoT DevKit Environment

To use the installer, you will need to [Download](https://devkitfiles.blob.core.windows.net/github/devkit_) and extract the `devkit_install_win.zip` file. 

Once completed, run `install.cmd` from the extracted directory.

> [!ALERT]: This version of the installer was used at the time of development. For the latest environment setup or if you wish to complete this manually, follow the [Install Development Environment](https://microsoft.github.io/azure-iot-developer-kit/docs/get-started/#install-development-environment) online guide.


## Cloud resources setup

### Create Azure Web App

The Azure App Service is an integrated offering for building and hosting web apps.

1. From the Azure Portal, go to the **Create a resource** option.
1. Search for ++Web App++.
1. Select the first result and click the **Create** button.
1. Provide the required information:
  * App name: mxchip-<your initials>.
  * Create a new resource group with the name: `mxchip-lab-<your initials>`.
  * Location: `West US`.
  * OS: Windows.
1. Click on App service plan/Location.
1. Click **Create** New.
1. Provide the required information:
  * App Service plan name: mxchip-lab-<your initials>.
  * Location: `West US`.
  * Pricing Tier: S1 Standard.
1. Click **OK** to save the new App service plan.
1. Click **Create** to deploy the service. This step might take a few moments.

### Create an Azure IoT Hub

1. From the Azure Portal, go to the **Create a resource** option.
1. Search for ++IoT Hub++.
1. Select the first result and click the **Create** button.
1. Provide the required information:
  * Subscription: select your subscription.
  * Select the resource group previously created: `mxchip-lab-<your initials>`.
  * Region: `West US`.
  * Name: `mxhub-<yourinitials>`.
1. Click on *Next: Size and scale*.
  * Pricing and scale tier: select F1(Free tier) if available, otherwise select S1(Standard).
1. Click on **Review + create**.
1. Review your IoT hub information, then click **Create**. This process might take a few minutes.

### Add a consumer group to your IoT Hub

Consumer groups are used by applications to pull data from Azure IoT Hub. To add a consumer group to your IoT hub, follow these steps:

1. In the Azure portal, go to **All Resources** in the left pane and **search** for your IoT Hub: `mxhub-<yourinitials>`.
1. **Click** on the resource to open it.
1. In the left pane, click **Endpoints**, select **Events** on the middle pane, look for the Consumer groups on the right pane.
1. Add a new consumer group with the name `mxchip` and then click **Save**.

### Get the connection script

1. Open your IoT Hub resource in Azure.
1. In the left pane, click **Shared access policies** and select **iothubowner** on the middle pane.
1. Copy the value of **Connection string—primary key** in a Notepad as you will need it later.

### Twitter setup

Create a Twitter App and get the following settings:
1. Apply for a [Twitter developer account](https://developer.twitter.com/en/apply/user) and wait for approval.
1. Once approved, you will be able to create new apps from [developer.twitter.com](https://developer.twitter.com/).
1. Create a new App and provide the application details.
  > [!NOTE] you can skip the callback url as we won't be using OAuth authentication. Follow [this link](https://developer.twitter.com/en/docs/basics/developer-portal/guides/apps) to get more information about creating Twitter Apps.
1. Get the following information from the **Keys and Access Tokens** tab:
  * Consumer Key (API Key)
  * Consumer Secret (API Secret)
  * Access token: Create a new one with `Read and Write` access.
  * Access token secret
  > [!NOTE] Copy these values as you will need them later.

## Deploying web application

### Update all app settings

1. Go to **Visual Studio** and open the **Web.config** file.
1. Use the information previously obtained to complete the settings that will be used to connect to your twitter:
  * TwitterAccountUrl: `https://twitter.com/<your_account_name>`
  * TwitterConsumerKey
  * TwitterConsumerSecret
  * TwitterAccessToken
  * TwitterAccessTokenSecret
1. Add the connection string for the IoT Hub:
  * IoTHubConnectionString

### Build the frontend

1. Open a **Terminal** window and navigate to `frontend/mx`.
1. Run the following commands:
  * yarn install
  * npm run build
1. Create a **wwwroot** directory in `backend/MXApi`.
1. Copy the contents of the **build** directory to `backend/MXApi/wwwroot`

### Deploy to Azure from Visual Studio

For the purposes of our lab, we'll be deploying directly from Visual Studio.

1. Open **Visual Studio** from the Start Menu.
1. Click **Open Project/Solution** and select `backend\MxDialBackend.sln`.
1. Click on the current connected account in the top right corner of Visual Studio.
1. Click on Account Settings....
1. Click on the Sign out button.
1. Click on the Sign in button.
1. Login with the same credentials as you used for Azure.

  > [!NOTE] This will connect Visual Studio to your Azure subscription.
1. Click **Close**.
1. Right-click the MxApi project.
1. Click **Publish**.
1. Mark the option Select Existing.
1. Click **Publish**.
1. Select the Web App previously created.
1. Click **OK** and wait for the deployment to complete. This step might take a few minutes.

## Deploying Arduino Solution to the MX Chip.

### Connect to WiFi
1. Connect the Micro-USB end to the IoT DevKit.
1. Connect the USB end to your computer.
1. The green LED for power confirms the connection.

![](https://devkitfiles.blob.core.windows.net/github/wifi-2.jpg)

4. Hold down button B, push and release the reset button, and then release button B. Your IoT DevKit enters AP mode for configuring the Wi-Fi connection. The screen displays the service set identifier (SSID) of the IoT DevKit and the configuration portal IP address:

![](https://devkitfiles.blob.core.windows.net/github/wifi-3.jpg)

5. Use a Web browser on a different Wi-Fi enabled device (computer or mobile phone) to connect to the IoT DevKit SSID displayed in the previous step. If it asks for a password, leave it empty.

![](https://devkitfiles.blob.core.windows.net/github/wifi-4.jpg)

6. Open 192.168.0.1 in the browser. Select the Wi-Fi network that you want the IoT DevKit to connect to, type the password for the Wi-Fi conection, and then click Connect.

![](https://devkitfiles.blob.core.windows.net/github/wifi-5.jpg)

7. The IoT DevKit reboots in a few seconds. You then see the Wi-Fi name and assigned IP.

![](https://devkitfiles.blob.core.windows.net/github/wifi-6.jpg)

### update endpoint to get device id
### update password to access above endpoint (if we still have auth).
### deploy code

## Testing solution
### link to script documentation.

## Troubleshooting
###c ommon issues






# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
