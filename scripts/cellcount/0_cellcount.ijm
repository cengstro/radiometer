// run this macro script on each image

// Convert to greyscale
run("8-bit");

// Subtract background
run("Subtract Background...", "radius=100 light");

// Boost contrast
run("Threshold...", "default B&W");

// Close the popup window
selectWindow("Threshold")
run("Close")

run("Make Binary"); // must run before fill holes
run("Fill Holes");
run("Convert to Mask");
run("Watershed");
run("Analyze Particles...", "size=400-50000 circularity=0.50-1.00 show=Outlines display summarize");

// In case where I manually edit the image, choose the last entry for that image ID in the results file as correct