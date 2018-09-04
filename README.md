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
1. IoT DevKit MX Device
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

>IMPORTANT!: This version of the installer was used at the time of development. For the latest environment setup or if you wish to complete this manually, follow the [Install Development Environment](https://microsoft.github.io/azure-iot-developer-kit/docs/get-started/#install-development-environment) online guide.


## Cloud resource setup
### Azure Web App Setup (get pub prof)
### Azure IoT Hub Setup (also consumer group)
### Tweeter setup

## Deploying web application
### update all app settings
### run script to build frontend and move to wwwroot
### deploy using publish prof

## Deploying MX chip 
### connect to wifi
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
