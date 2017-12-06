
namespace eval fnCostTasks1 {
  variable rows
  variable frame
  variable project
  array set rows {}

  proc open { space id } {
    variable frame $space
    variable project $id
    array set event [list \
      query select \
      module fnCostTasks1 \
      from fnCostTasks1 \
      project $id
    ]
    chan puts $MAIN::chan [array get event]
  }

  proc 'do'download { resp } {
    upvar $resp response
   #set cdown [socket {x12.m3c.space} 12346]
    set cdown [socket localhost 12346]
    chan configure $cdown -buffering full -translation binary
    array set event {
      query download
      module fnCostTasks1
    }
    set event(filepath) $response(filepath)
    chan puts $cdown [array get event]
    flush $cdown
    set data [chan read $cdown]
    flush $cdown
    close $cdown

    set fp [::open $response(filepath) w+]
    fconfigure $fp -buffering full -translation binary
    puts $fp $data
    flush $fp
    close $fp
  }

  proc 'do'update { resp } {
    variable frame
    variable project
    upvar $resp response
    array set row [deserialize $response(row)]
    variable rows
    array set rows [list $row(id) $response(row)]
  }

  proc 'do'insert { resp } {
    upvar $resp response
    array set row [deserialize $response(row)]

    if { $row(project) != $project } {
      return
    }
    'do'select response
  }

  proc 'do'select { resp } {
    variable frame
    upvar $resp response
    array set row [deserialize $response(row)]
    variable rows
    array set rows [list $row(id) $response(row)]
  }
}
